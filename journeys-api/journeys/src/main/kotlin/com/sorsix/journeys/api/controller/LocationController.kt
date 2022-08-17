package com.sorsix.journeys.api.controller

import com.sorsix.journeys.api.response.LocationInfoListResponse
import com.sorsix.journeys.api.response.LocationResponse
import com.sorsix.journeys.api.response.PublicLocation
import com.sorsix.journeys.service.LocationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/location")
class LocationController(
    val locationService: LocationService
) {
    @GetMapping("/find")
    fun findLocationsByName(@RequestParam term: String): ResponseEntity<LocationResponse> =
        ResponseEntity.ok(
            LocationInfoListResponse(
                locationService.findLocationsByName(term).map { PublicLocation(it) })
        )

    @GetMapping("/find_ids")
    fun findLocationsByIds(@RequestParam ids: List<Long>): ResponseEntity<LocationResponse> =
        ResponseEntity.ok(
            LocationInfoListResponse(
                ids.mapNotNull { locationService.findLocationById(it) }.map { PublicLocation(it) })
        )
}