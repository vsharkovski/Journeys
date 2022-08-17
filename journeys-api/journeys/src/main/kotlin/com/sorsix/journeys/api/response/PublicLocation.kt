package com.sorsix.journeys.api.response

import com.sorsix.journeys.domain.Location

data class PublicLocation(
    val id: Long,
    val name: String,
    val latitude: Float,
    val longitude: Float
) {
    constructor(location: Location) : this(
        id = location.id,
        name = location.name,
        latitude = location.latitude,
        longitude = location.longitude
    )
}