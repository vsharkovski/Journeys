package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.request.CreatePostCommentRequest
import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.security.service.UserDetailsImpl
import com.sorsix.journeys.service.CommentService
import com.sorsix.journeys.service.ResponseCreationService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api/post")
class CommentController(
    val commentService: CommentService,
    val responseCreationService: ResponseCreationService
) {
    @GetMapping("/{postId}/comments")
    fun getCommentsOnAPost(
        @PathVariable postId: Long,
        @RequestParam(required = false) count: Int?
    ): ResponseEntity<PostCommentResponse> {
        val comments = if (count != null) {
            commentService.findRecent5PostCommentsOnAPost(postId)
        } else {
            commentService.findAllPostCommentsOnAPost(postId)
        }
        return ResponseEntity.ok(
            PostCommentInfoListResponse(
                comments.map { responseCreationService.createPublicPostComment(it, authorProfilePicture = true) })
        )
    }

    @GetMapping("/{postId}/comments_num")
    fun getNumOfCommentsOnAPost(@PathVariable postId: Long): ResponseEntity<PostCommentResponse> =
        ResponseEntity.ok(PostCommentCountResponse(commentService.countAllPostCommentsOnAPost(postId)))

    @GetMapping("/{userId}/posts_commented_on")
    fun getAllPostsCommentedByUser(@PathVariable userId: Long): ResponseEntity<PostResponse> =
        ResponseEntity.ok(
            PostInfoListResponse(
                commentService.findAllPostsCommentedByUser(userId)
                    .map { responseCreationService.createPublicPost(it) })
        )

    @PostMapping("/{postId}/comment")
    @PreAuthorize("hasRole('USER')")
    fun createPostComment(
        @RequestBody @Valid request: CreatePostCommentRequest,
        @PathVariable postId: Long
    ): ResponseEntity<PostCommentResponse> {
        val userId = responseCreationService.getAuthenticatedUserId()!!
        val result = commentService
            .createPostComment(userId, postId, request.comment)
        return when (result) {
            is PostCommentCreated ->
                ResponseEntity.ok(
                    PostCommentInfoResponse(responseCreationService.createPublicPostComment(result.postComment))
                )
            is PostCommentMissingPostError ->
                ResponseEntity.badRequest()
                    .body(PostCommentMessageResponse(false, "Invalid post Id"))
            is PostCommentMissingUserError ->
                ResponseEntity.badRequest()
                    .body(PostCommentMessageResponse(false, "Invalid user Id"))
            is PostCommentSavingError ->
                ResponseEntity.internalServerError()
                    .body(PostCommentMessageResponse(false, "Failed to create post comment"))
            else ->
                throw RuntimeException("Impossible PostResult")
        }
    }

    @DeleteMapping("/{postId}/comment/{commentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    fun deletePostComment(
        @PathVariable postId: Long,
        @PathVariable commentId: Long,
    ): ResponseEntity<PostCommentResponse> =
        commentService.findPostCommentById(commentId)?.let { comment ->
            if (comment.postId == postId) {
                val userDetails = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
                if (comment.author.id == userDetails.id || userDetails.authorities.any { it.authority == "ADMIN" }) {
                    when (commentService.deletePostComment(commentId)) {
                        is PostCommentDeleted ->
                            ResponseEntity.ok(PostCommentMessageResponse(true, "Comment deleted"))
                        else ->
                            ResponseEntity.internalServerError()
                                .body(PostCommentMessageResponse(false, "Internal error"))
                    }
                } else {
                    ResponseEntity.badRequest().body(PostCommentMessageResponse(false, "Unauthorized"))
                }
            } else {
                ResponseEntity.badRequest().body(PostCommentMessageResponse(false, "Invalid post Id"))
            }
        } ?: ResponseEntity.badRequest().body(PostCommentMessageResponse(false, "Invalid comment Id"))
}