package com.sorsix.journeys.service

import com.sorsix.journeys.api.response.PublicLocation
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.LocationRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class LocationService(
    val locationRepository: LocationRepository
) {
    private val logger = LoggerFactory.getLogger(LocationService::class.java)

    fun findLocationById(id: Long): Location? = locationRepository.findByIdOrNull(id)

    fun findLocationsByName(term: String): List<Location> = locationRepository.findByNameContainingIgnoreCase(term)

    fun createLocation(name: String, latitude: Float, longitude: Float): LocationResult {
        val location = Location(name = name, latitude = latitude, longitude = longitude)
        logger.info("Saving location [{}]", location)
        return try {
            LocationCreated(locationRepository.save(location))
        } catch (e: Exception) {
            logger.error("Error in saving location [{}]", e.message, e)
            LocationSavingError
        }
    }

    fun processAndCreateLocations(locations: List<PublicLocation>): List<Location> =
        locations.mapNotNull {
            if (it.id == 0L) {
                when (val result = createLocation(it.name, it.latitude, it.longitude)) {
                    is LocationCreated -> result.location
                    else -> null
                }
            } else {
                findLocationById(it.id)
            }
        }
}