package com.sorsix.journeys.domain

sealed interface LocationResult

data class LocationCreated(val location: Location) : LocationResult

object LocationSavingError : LocationResult