package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.ERole
import com.sorsix.journeys.domain.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository : JpaRepository<Role, Long> {
    fun findByName(name: ERole): Role?
}