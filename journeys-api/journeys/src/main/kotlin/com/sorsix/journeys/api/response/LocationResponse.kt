package com.sorsix.journeys.api.response

sealed interface LocationResponse : Response

data class LocationMessageResponse(override val success: Boolean, val message: String) : LocationResponse

data class LocationInfoListResponse(val locations: List<PublicLocation>) : LocationResponse {
    override val success = true
}