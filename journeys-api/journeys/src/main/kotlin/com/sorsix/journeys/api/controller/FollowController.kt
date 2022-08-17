package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.service.FollowService
import com.sorsix.journeys.service.ResponseCreationService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class FollowController(
    val followService: FollowService,
    val responseCreationService: ResponseCreationService
) {
    @PostMapping("/{followedId}/follow")
    @PreAuthorize("hasRole('USER')")
    fun followUser(@PathVariable followedId: Long): ResponseEntity<FollowResponse> =
        when (followService.followUser(followedId)) {
            is FollowerFollow ->
                ResponseEntity
                    .ok(FollowMessageResponse(true, "Follow success"))
            is FollowedUserNotFound ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Follower user id not found"))
            is AlreadyFollowingError ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Already following this user"))
            is FollowerFollowError ->
                ResponseEntity.internalServerError()
                    .body(FollowMessageResponse(false, "Cannot save to database"))
            is SelfFollowError ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Self follow error"))
            else -> {
                ResponseEntity.internalServerError()
                    .body(FollowMessageResponse(false, "Internal error"))
            }
        }

    @PostMapping("/{followedId}/unfollow")
    @PreAuthorize("hasRole('USER')")
    fun unfollowUser(@PathVariable followedId: Long): ResponseEntity<FollowResponse> =
        when (followService.unfollowUser(followedId)) {
            is FollowerUnfollow ->
                ResponseEntity
                    .ok(FollowMessageResponse(true, "Unfollow success"))
            is FollowedUserNotFound ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Follower user id not found"))
            is NotFollowingError ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Not following this user"))
            is FollowerUnfollowError ->
                ResponseEntity.internalServerError()
                    .body(FollowMessageResponse(false, "Cannot save to database"))
            is SelfUnfollowError ->
                ResponseEntity.badRequest()
                    .body(FollowMessageResponse(false, "Self unfollow error"))
            else -> {
                ResponseEntity.internalServerError()
                    .body(FollowMessageResponse(false, "Internal error"))
            }
        }

    @GetMapping("/{id}/followers")
    fun getUserFollowers(@PathVariable id: Long): ResponseEntity<UserResponse> =
        ResponseEntity.ok(
            UserInfoListResponse(
                followService.findAllUserFollowers(id).map { responseCreationService.createPublicUser(it) })
        )

    @GetMapping("/{id}/following")
    fun getUserFollowing(@PathVariable id: Long): ResponseEntity<UserResponse> =
        ResponseEntity.ok(
            UserInfoListResponse(
                followService.findAllUserFollowing(id).map { responseCreationService.createPublicUser(it) })
        )

    @GetMapping("/{id}/followers_num")
    fun getUserFollowersNumber(@PathVariable id: Long): ResponseEntity<FollowResponse> =
        ResponseEntity.ok(
            FollowCountResponse(
                followService.countAllUserFollowers(id)
            )
        )

    @GetMapping("/{id}/following_num")
    fun getUserFollowingNumber(@PathVariable id: Long): ResponseEntity<FollowResponse> =
        ResponseEntity.ok(
            FollowCountResponse(
                followService.countAllUserFollowing(id)
            )
        )
}