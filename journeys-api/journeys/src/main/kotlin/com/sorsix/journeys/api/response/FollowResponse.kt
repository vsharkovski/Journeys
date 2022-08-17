package com.sorsix.journeys.api.response

sealed interface FollowResponse : Response

data class FollowMessageResponse(override val success: Boolean, val message: String) : FollowResponse

data class FollowCountResponse(val count: Int) : FollowResponse {
    override val success = true
}