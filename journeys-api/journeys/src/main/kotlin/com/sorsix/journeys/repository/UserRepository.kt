package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Long> {
    fun findByUsernameIgnoreCase(username: String): User?

    fun existsByUsernameIgnoreCase(username: String): Boolean

    fun existsByEmailIgnoreCase(email: String): Boolean

    fun findByUsernameContainingIgnoreCase(term: String): List<User>
}