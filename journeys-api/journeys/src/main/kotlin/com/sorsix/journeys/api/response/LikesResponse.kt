package com.sorsix.journeys.api.response

sealed interface LikesResponse : Response

data class LikesMessageResponse(override val success: Boolean, val message: String) : LikesResponse

data class LikeCountResponse(val count: Int) : LikesResponse {
    override val success = true
}