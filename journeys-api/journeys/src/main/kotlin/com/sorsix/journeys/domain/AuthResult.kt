package com.sorsix.journeys.domain

sealed interface AuthLoginResult

data class AuthLoginSuccess(
    val id: Long,
    val username: String,
    val email: String,
    val roles: List<String>,
    val jwtCookie: String
) : AuthLoginResult

object AuthLoginFail : AuthLoginResult

sealed interface AuthRegisterResult

object AuthRegisterSuccess : AuthRegisterResult

object AuthUsernameExistsFail : AuthRegisterResult

object AuthEmailExistsFail : AuthRegisterResult

object AuthSavingUserFail : AuthRegisterResult
