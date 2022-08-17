package com.sorsix.journeys.api.response

import com.sorsix.journeys.domain.Role

data class PublicUser(
    val id: Long,
    val username: String,
    val roles: List<Role> = listOf(),
    val authData: UserAuthEmbed?,
    val followerCount: Int?,
    val followingCount: Int?,
    val profilePicture: ByteArray? = null,
    val profilePictureFormat: String? = null,
)