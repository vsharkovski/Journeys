package com.sorsix.journeys.api.response

data class PublicPostComment(
    val id: Long,
    val author: PublicUser,
    val postId: Long,
    val comment: String,
    val timestampCreated: Long
)