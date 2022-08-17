package com.sorsix.journeys.api.response

sealed interface SearchResponse : Response

data class SearchPostsUsersResponse(
    val users: List<PublicUser>,
    val posts: List<PublicPost>
) : SearchResponse {
    override val success = true
}

data class SearchPostsResponse(
    val posts: List<PublicPost>
) : SearchResponse {
    override val success = true
}