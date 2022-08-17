package com.sorsix.journeys.security.service

import com.sorsix.journeys.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class UserDetailsServiceImpl(
    val userRepository: UserRepository
) : UserDetailsService {
    @Transactional
    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByUsernameIgnoreCase(username)?.let {
            UserDetailsImpl(it)
        } ?: throw UsernameNotFoundException("User not found with username: $username")

}