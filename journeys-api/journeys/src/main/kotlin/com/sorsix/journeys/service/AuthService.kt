package com.sorsix.journeys.service

import com.sorsix.journeys.api.request.LoginRequest
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.RoleRepository
import com.sorsix.journeys.repository.UserRepository
import com.sorsix.journeys.security.jwt.JwtUtils
import com.sorsix.journeys.security.service.UserDetailsImpl
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    val authenticationManager: AuthenticationManager,
    val userRepository: UserRepository,
    val roleRepository: RoleRepository,
    val passwordEncoder: PasswordEncoder,
    val jwtUtils: JwtUtils
) {
    private val logger = LoggerFactory.getLogger(PostService::class.java)

    fun authenticateUser(loginRequest: LoginRequest): AuthLoginResult {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )
        SecurityContextHolder.getContext().authentication = authentication
        val userDetails = authentication.principal as UserDetailsImpl
        val jwtCookie = jwtUtils.generateJwtCookie(userDetails)
        return AuthLoginSuccess(
            userDetails.id, userDetails.username, userDetails.email,
            userDetails.authorities.map { it.authority.toString() }, jwtCookie.toString()
        )
    }

    fun registerUser(
        username: String,
        password: String,
        email: String,
        rolesStr: Set<String>,
        profilePicture: ByteArray?,
        profilePictureFormat: String?
    ): AuthRegisterResult {
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            return AuthUsernameExistsFail
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return AuthEmailExistsFail
        }
        val roles = HashSet<Role>()
        if (rolesStr.isEmpty()) {
            roleRepository.findByName(ERole.ROLE_USER)?.let { roles.add(it) }
                ?: throw RuntimeException("Role not found.")
        } else {
            val stringRoleToEnum = mapOf("admin" to ERole.ROLE_ADMIN, "user" to ERole.ROLE_USER)
            rolesStr.forEach {
                val roleEnum = stringRoleToEnum[it] ?: throw RuntimeException("Unrecognized role.")
                val role = roleRepository.findByName(roleEnum) ?: throw RuntimeException("Role not found.")
                roles.add(role)
            }
        }
        val user =
            User(0, username, email, passwordEncoder.encode(password), roles, profilePicture, profilePictureFormat)
        return try {
            logger.info("Saving new user [{}]", user)
            userRepository.save(user)
            AuthRegisterSuccess
        } catch (e: Exception) {
            AuthSavingUserFail
        }
    }
}