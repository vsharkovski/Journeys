package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Followers
import com.sorsix.journeys.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FollowersRepository : JpaRepository<Followers, Long> {
    fun existsByFollowerIdAndFollowedId(follower: Long, followed: Long): Boolean

    fun deleteFollowersByFollowerIdAndFollowedId(follower: Long, followed: Long)

    @Query("select u from User u join Followers f on u.id = f.followerId where f.followedId = ?1")
    fun findAllByFollowedId(id: Long): List<User>

    @Query("select u from User u join Followers f on u.id = f.followedId where f.followerId = ?1")
    fun findAllByFollowerId(id: Long): List<User>

}