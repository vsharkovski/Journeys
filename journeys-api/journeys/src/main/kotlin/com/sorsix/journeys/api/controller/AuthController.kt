package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.request.LoginRequest
import com.sorsix.journeys.api.response.AuthMessageResponse
import com.sorsix.journeys.api.response.AuthResponse
import com.sorsix.journeys.api.response.AuthUserInfoResponse
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.security.jwt.JwtUtils
import com.sorsix.journeys.service.AuthService
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.validation.Valid
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@RestController
@RequestMapping("/api/auth")
class AuthController(
    val authService: AuthService,
    val jwtUtils: JwtUtils
) {
    @PostMapping("/sign_in")
    fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<AuthResponse> =
        when (val result = authService.authenticateUser(loginRequest)) {
            is AuthLoginSuccess ->
                ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, result.jwtCookie)
                    .body(AuthUserInfoResponse(result.id, result.username, result.email, result.roles))
            is AuthLoginFail -> ResponseEntity.badRequest().body(AuthMessageResponse(false, "Bad credentials"))
        }

    @PostMapping("/sign_up")
    fun registerUser(
        @RequestParam @NotBlank @Size(min = 3, max = 20) username: String,
        @RequestParam @NotBlank @Size(max = 50) @Email email: String,
        @RequestParam @NotBlank @Size(min = 6, max = 40) password: String,
        @RequestParam(required = false, defaultValue = "") role: Set<String>,
        @RequestParam(required = false) profilePicture: MultipartFile?,
    ): ResponseEntity<AuthResponse> =
        when (authService.registerUser(
            username = username,
            password = password,
            email = email,
            rolesStr = role,
            profilePicture = profilePicture?.bytes,
            profilePictureFormat = profilePicture?.contentType
        )) {
            is AuthRegisterSuccess ->
                ResponseEntity.ok(AuthMessageResponse(true, "User registered successfully"))
            is AuthUsernameExistsFail ->
                ResponseEntity.badRequest().body(AuthMessageResponse(false, "Username already exists"))
            is AuthEmailExistsFail ->
                ResponseEntity.badRequest().body(AuthMessageResponse(false, "Email is already in use"))
            is AuthSavingUserFail ->
                ResponseEntity.badRequest().body(AuthMessageResponse(false, "Internal server error"))
        }

    @PostMapping("/sign_out")
    fun logoutUser(): ResponseEntity<AuthResponse> {
        val cookie = jwtUtils.getCleanJwtCookie()
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(AuthMessageResponse(true, "Sign out successful."))
    }
}