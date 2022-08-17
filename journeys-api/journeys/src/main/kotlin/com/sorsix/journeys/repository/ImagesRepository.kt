package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Image
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImagesRepository : JpaRepository<Image, Long> {
}