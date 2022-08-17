package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.service.ResponseCreationService
import com.sorsix.journeys.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    val userService: UserService,
    val responseCreationService: ResponseCreationService
) {

    @GetMapping(value = ["", "/"])
    fun getUsers(
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") followerCount: Boolean,
        @RequestParam(required = false, defaultValue = "false") followingCount: Boolean,
    ): ResponseEntity<UserResponse> =
        ResponseEntity.ok(
            UserInfoListResponse(
                userService.findAllUsers().map {
                    responseCreationService.createPublicUser(
                        it,
                        authData = authData,
                        followerCount = followerCount,
                        followingCount = followingCount,
                        profilePicture = true,
                    )
                })
        )

    @GetMapping("/{id}")
    fun getUserById(
        @PathVariable id: Long,
        @RequestParam(required = false, defaultValue = "false") authData: Boolean,
        @RequestParam(required = false, defaultValue = "false") followerCount: Boolean,
        @RequestParam(required = false, defaultValue = "false") followingCount: Boolean,
    ): ResponseEntity<UserResponse> =
        userService.findUserById(id)?.let {
            ResponseEntity.ok(
                UserInfoResponse(
                    responseCreationService.createPublicUser(
                        it,
                        authData = authData,
                        followerCount = followerCount,
                        followingCount = followingCount,
                        profilePicture = true
                    )
                )
            )
        } ?: ResponseEntity.badRequest().body(UserMessageResponse(false, "Invalid User Id"))

}