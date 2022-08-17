package com.sorsix.journeys.api.response

sealed interface UserResponse : Response

data class UserMessageResponse(override val success: Boolean, val message: String) : UserResponse

data class UserInfoResponse(val user: PublicUser) : UserResponse {
    override val success = true
}

data class UserInfoListResponse(val users: List<PublicUser>) : UserResponse {
    override val success = true
}
