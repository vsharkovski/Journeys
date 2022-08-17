package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.service.LikeService
import com.sorsix.journeys.service.ResponseCreationService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/post")
class LikeController(
    val likeService: LikeService,
    val responseCreationService: ResponseCreationService
) {
    @GetMapping("/{postId}/likes")
    fun getAllLikesOnAPost(@PathVariable postId: Long): ResponseEntity<UserResponse> =
        ResponseEntity.ok(
            UserInfoListResponse(
                likeService.findAllUsersThatLikedThePost(postId).map { responseCreationService.createPublicUser(it) })
        )

    @GetMapping("/{postId}/likes_num")
    fun getNumOfLikesOnAPost(@PathVariable postId: Long): ResponseEntity<LikesResponse> =
        ResponseEntity.ok(
            LikeCountResponse(
                likeService.countAllUsersThatLikedThePost(postId)
            )
        )

    @GetMapping("/{userId}/posts_liked")
    fun getAllPostsLikedByUser(
        @PathVariable userId: Long, @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") countLikes: Boolean,
        @RequestParam(required = false, defaultValue = "false") countComments: Boolean,
        @RequestParam(required = false) fetchComments: Int?,
        @RequestParam(required = false) fetchLocations: Int?
    ): ResponseEntity<PostResponse> =
        ResponseEntity.ok(
            PostInfoListResponse(
                likeService.findAllPostsLikedByUser(userId).map {
                    responseCreationService.createPublicPost(
                        it, authData = authData,
                        countLikes = countLikes,
                        countComments = countComments,
                        fetchComments = fetchComments,
                        fetchLocations = fetchLocations
                    )
                })
        )

    @PostMapping("/{postId}/like")
    @PreAuthorize("hasRole('USER')")
    fun likePost(@PathVariable postId: Long): ResponseEntity<LikesResponse> =
        when (likeService.likePost(postId)) {
            is PostLike ->
                ResponseEntity.ok(LikesMessageResponse(true, "Like success"))
            is AlreadyLikedError ->
                ResponseEntity.badRequest()
                    .body(LikesMessageResponse(false, "The post is already liked"))
            is PostLikeError ->
                ResponseEntity.internalServerError()
                    .body(LikesMessageResponse(false, "Cannot save to database"))
            else -> {
                ResponseEntity.internalServerError()
                    .body(LikesMessageResponse(false, "Internal error"))
            }
        }

    @PostMapping("/{postId}/unlike")
    @PreAuthorize("hasRole('USER')")
    fun unlikePost(@PathVariable postId: Long): ResponseEntity<LikesResponse> =
        when (likeService.unlikePost(postId)) {
            is PostUnlike ->
                ResponseEntity.ok(LikesMessageResponse(true, "Unlike success"))
            is NotLikedError ->
                ResponseEntity.badRequest()
                    .body(LikesMessageResponse(false, "The post is not liked"))
            is PostUnlikeError ->
                ResponseEntity.internalServerError()
                    .body(LikesMessageResponse(false, "Cannot save to database"))
            else -> {
                ResponseEntity.internalServerError()
                    .body(LikesMessageResponse(false, "Internal error"))
            }
        }
}