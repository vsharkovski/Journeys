package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.Post
import com.sorsix.journeys.domain.User
import com.sorsix.journeys.service.LocationService
import com.sorsix.journeys.service.PostService
import com.sorsix.journeys.service.ResponseCreationService
import com.sorsix.journeys.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/search")
class SearchController(
    val postService: PostService,
    val userService: UserService,
    val locationService: LocationService,
    val responseCreationService: ResponseCreationService
) {

    @GetMapping("/multi")
    fun findPostsAndUsersBySearchText(@RequestParam term: String): ResponseEntity<SearchResponse> {
        val users: List<User> = userService.findUsersByUsernameContaining(term)
        val posts: List<Post> = postService.findPostsByTitleLike(term)
        return ResponseEntity.ok(
            SearchPostsUsersResponse(
                users.map { responseCreationService.createPublicUser(it, profilePicture = true) },
                posts.map { responseCreationService.createPublicPost(it) })
        )
    }

    @GetMapping("/complex")
    fun findPostsComplex(
        @RequestParam(required = false) term: String,
        @RequestParam(required = false, defaultValue = "0") minCost: Int,
        @RequestParam(required = false, defaultValue = "10000") maxCost: Int,
        @RequestParam(required = false, defaultValue = "") locationsIds: List<Long>,
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") countLikes: Boolean,
        @RequestParam(required = false, defaultValue = "false") countComments: Boolean,
        @RequestParam(required = false) fetchComments: Int?,
        @RequestParam(required = false) fetchLocations: Int?
    ): ResponseEntity<SearchPostsResponse> {
        val locations = locationsIds.mapNotNull { locationService.findLocationById(it) }
        return ResponseEntity.ok(
            SearchPostsResponse(
                postService.findPostsComplex(term, minCost, maxCost, locations)
                    .map {
                        responseCreationService.createPublicPost(
                            it,
                            authData = authData,
                            countLikes = countLikes,
                            countComments = countComments,
                            fetchComments = fetchComments,
                            fetchLocations = fetchLocations,
                            authorProfilePicture = true
                        )
                    })
        )
    }

}