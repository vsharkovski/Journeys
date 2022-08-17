package com.sorsix.journeys.service

import com.sorsix.journeys.domain.User
import com.sorsix.journeys.repository.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class UserService(
    val userRepository: UserRepository,
) {
    fun findAllUsers(): List<User> = userRepository.findAll()

    fun findUserById(id: Long): User? = userRepository.findByIdOrNull(id)

    fun findUsersByUsernameContaining(term: String): List<User> =
        userRepository.findByUsernameContainingIgnoreCase(term)
}