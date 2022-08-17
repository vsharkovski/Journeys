package com.sorsix.journeys.api.response

sealed interface PostCommentResponse : Response

data class PostCommentMessageResponse(override val success: Boolean, val message: String) : PostCommentResponse

data class PostCommentCountResponse(val count: Int) : PostCommentResponse {
    override val success = true
}

data class PostCommentInfoResponse(val postComment: PublicPostComment) : PostCommentResponse {
    override val success = true
}

data class PostCommentInfoListResponse(val postComments: List<PublicPostComment>) : PostCommentResponse {
    override val success = true
}