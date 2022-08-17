package com.sorsix.journeys.api.response

data class PublicPost(
    val id: Long,
    val author: PublicUser,
    val title: String,
    val description: String,
    val cost: Int,
    val costComment: String,
    val likeCount: Int?,
    val commentCount: Int?,
    val comments: List<PublicPostComment>?,
    val locations: List<PublicLocation>?,
    val authData: PostAuthEmbed?,
    val picture: ByteArray? = null,
    val pictureFormat: String? = null,
    val timestampCreated: Long,
)