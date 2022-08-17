package com.sorsix.journeys.api.controller

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.security.service.UserDetailsImpl
import com.sorsix.journeys.service.*
import org.hibernate.validator.constraints.Range
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

inline fun <reified T> ObjectMapper.readValue(json: String): T = readValue(json, object : TypeReference<T>() {})

@RestController
@RequestMapping("/api/post")
class PostController(
    val userService: UserService,
    val postService: PostService,
    val locationService: LocationService,
//    val imagesService: ImagesService,
    val responseCreationService: ResponseCreationService,
) {
    val jsonMapper = jacksonObjectMapper()

    @GetMapping(value = ["", "/"])
    fun getPosts(
        @RequestParam(required = false, defaultValue = "false") onlyFollowed: Boolean,
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") countLikes: Boolean,
        @RequestParam(required = false, defaultValue = "false") countComments: Boolean,
        @RequestParam(required = false) fetchComments: Int?,
        @RequestParam(required = false) fetchLocations: Int?
    ): ResponseEntity<PostResponse> {
        val posts = if (onlyFollowed) {
            responseCreationService.getAuthenticatedUserId()?.let { id ->
                postService.findPostsFromFollowedAuthors(id)
            } ?: postService.findAllPosts()
        } else {
            postService.findAllPosts()
        }
        return ResponseEntity.ok(PostInfoListResponse(posts.map {
            responseCreationService.createPublicPost(
                it,
                authData = authData,
                countLikes = countLikes,
                countComments = countComments,
                fetchComments = fetchComments,
                fetchLocations = fetchLocations,
                picture = it.picture != null
            )
        }))
    }

    @GetMapping("/{id}")
    fun getPostById(
        @PathVariable id: Long,
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") countLikes: Boolean,
        @RequestParam(required = false, defaultValue = "false") countComments: Boolean,
        @RequestParam(required = false) fetchComments: Int?,
        @RequestParam(required = false) fetchLocations: Int?
    ): ResponseEntity<PostResponse> =
        postService.findPostById(id)?.let {
            ResponseEntity.ok(
                PostInfoResponse(
                    responseCreationService.createPublicPost(
                        it,
                        authData = authData,
                        countLikes = countLikes,
                        countComments = countComments,
                        fetchComments = fetchComments,
                        fetchLocations = fetchLocations,
                        picture = it.picture != null
                    )
                )
            )
        } ?: ResponseEntity.badRequest().body(PostMessageResponse(false, "Invalid Post Id"))

    @GetMapping("/user/{userId}")
    fun getPostsByUser(
        @PathVariable userId: Long,
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") countLikes: Boolean,
        @RequestParam(required = false, defaultValue = "false") countComments: Boolean,
        @RequestParam(required = false) fetchComments: Int?,
        @RequestParam(required = false) fetchLocations: Int?
    ): ResponseEntity<PostResponse> =
        userService.findUserById(userId)?.let {
            ResponseEntity.ok(PostInfoListResponse(postService.findPostsByUserId(userId).map {
                responseCreationService.createPublicPost(
                    it,
                    authData = authData,
                    countLikes = countLikes,
                    countComments = countComments,
                    fetchComments = fetchComments,
                    fetchLocations = fetchLocations,
                    picture = it.picture != null
                )
            }))
        } ?: ResponseEntity.badRequest().body(PostMessageResponse(false, "Invalid User Id"))

    @PostMapping(value = ["", "/"], consumes = ["multipart/form-data"])
    @PreAuthorize("hasRole('USER')")
    fun createPost(
        @RequestParam @NotBlank title: String,
        @RequestParam @NotNull @Size(min = 0, max = 10000) description: String,
        @RequestParam @NotNull @Range(min = 0, max = 10000) totalCost: String,
        @RequestParam @NotNull costComment: String,
        @RequestParam(name = "locations") locationsString: String,
        @RequestParam(required = false) picture: MultipartFile?
    ): ResponseEntity<PostResponse> {
        val userDetails = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        val locations: List<PublicLocation> = try {
            jsonMapper.readValue(locationsString)
        } catch (e: Exception) {
            listOf()
        }
        val locationsProcessed = locationService.processAndCreateLocations(locations)
        val postResult = postService
            .createPost(
                userId = userDetails.id,
                title = title,
                description = description,
                cost = Integer.valueOf(totalCost),
                costComment = costComment,
                locations = locationsProcessed,
                picture = picture
            )
        return when (postResult) {
            is PostCreated ->
                ResponseEntity.ok(
                    PostInfoResponse(
                        responseCreationService.createPublicPost(
                            postResult.post,
                            authData = true,
                            countComments = true,
                            fetchLocations = 20,
                            picture = true
                        )
                    )
                )
            is PostMissingUserError ->
                ResponseEntity.badRequest()
                    .body(PostMessageResponse(false, "Invalid User Id"))
            is PostSavingError ->
                ResponseEntity.internalServerError()
                    .body(PostMessageResponse(false, "Failed to create post"))
            else ->
                throw RuntimeException("Impossible PostResult")
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    fun deletePost(@PathVariable id: Long): ResponseEntity<PostResponse> {
        val userDetails = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        return postService.findPostById(id)?.let { post ->
            if (post.author.id == userDetails.id || userDetails.authorities.any { it.authority == "ADMIN" }) {
                when (postService.deletePost(id)) {
                    is PostDeleted ->
                        ResponseEntity.ok(PostMessageResponse(true, "Post deleted"))
                    is PostDeletionError ->
                        ResponseEntity.internalServerError().body(
                            PostMessageResponse(false, "Internal server error")
                        )
                    else -> throw RuntimeException("Impossible PostResult")
                }
            } else {
                ResponseEntity.badRequest().body(PostMessageResponse(false, "Unauthorized"))
            }
        } ?: ResponseEntity.badRequest().body(PostMessageResponse(false, "Invalid Post Id"))
    }
}