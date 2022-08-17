package com.sorsix.journeys.api.request

import javax.validation.constraints.NotBlank

data class LoginRequest(
    @get:NotBlank
    val username: String,

    @get:NotBlank
    val password: String
)
