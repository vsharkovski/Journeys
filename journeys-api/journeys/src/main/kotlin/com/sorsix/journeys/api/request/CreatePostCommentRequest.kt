package com.sorsix.journeys.api.request

import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

data class CreatePostCommentRequest(
    @get:NotBlank
    @get:Size(min = 6, max = 500)
    val comment: String
)
