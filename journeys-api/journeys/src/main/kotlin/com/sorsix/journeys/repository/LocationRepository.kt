package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Location
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LocationRepository : JpaRepository<Location, Long> {
    fun findByNameContainingIgnoreCase(term: String): List<Location>
}