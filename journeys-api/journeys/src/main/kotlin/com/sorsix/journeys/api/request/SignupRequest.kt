package com.sorsix.journeys.api.request

import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

data class SignupRequest(
    @get:NotBlank
    @get:Size(min = 3, max = 20)
    val username: String,

    @get:NotBlank
    @get:Size(max = 50)
    @get:Email
    val email: String,

    @get:NotBlank
    @get:Size(min = 6, max = 40)
    val password: String,

    val role: Set<String> = setOf()
)
