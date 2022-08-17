package com.sorsix.journeys.service

import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.FollowersRepository
import com.sorsix.journeys.repository.UserRepository
import com.sorsix.journeys.security.service.UserDetailsImpl
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class FollowService(
    val userRepository: UserRepository,
    val followersRepository: FollowersRepository
) {

    private val logger = LoggerFactory.getLogger(FollowService::class.java)

    fun isUserFollowingUser(followerId: Long, followedId: Long): Boolean =
        followersRepository.existsByFollowerIdAndFollowedId(followerId, followedId)

    @Transactional
    fun followUser(followedId: Long): FollowersResult {
        val followerUser = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        val followedUser = userRepository.findById(followedId)
        return if (followedUser.isEmpty)
            FollowedUserNotFound
        else if (followedId == followerUser.id)
            SelfFollowError
        else if (isUserFollowingUser(followerUser.id, followedId))
            AlreadyFollowingError
        else {
            val follower = Followers(0, followerId = followerUser.id, followedId = followedId)
            logger.info("Saving follower [{}]", follower)
            return try {
                FollowerFollow(followersRepository.save(follower))
            } catch (e: Exception) {
                logger.error("Error in saving follower [{}]", e.message, e)
                FollowerFollowError
            }
        }
    }

    @Transactional
    fun unfollowUser(followedId: Long): FollowersResult {
        val followerUser = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        val followedUser = userRepository.findById(followedId)
        return if (followedUser.isEmpty)
            FollowedUserNotFound
        else if (followedId == followerUser.id)
            SelfUnfollowError
        else if (!isUserFollowingUser(followerUser.id, followedId))
            NotFollowingError
        else {
            try {
                logger.info(
                    "Deleting followers with follower id [{}] and followed id [{}]",
                    followerUser.id,
                    followedId
                )
                followersRepository.deleteFollowersByFollowerIdAndFollowedId(followerUser.id, followedId)
                FollowerUnfollow(followerUser.id, followedId)
            } catch (e: Exception) {
                logger.error("Error in deleting follower [{}]", e.message, e)
                FollowerUnfollowError
            }
        }
    }

    fun findAllUserFollowers(id: Long): List<User> = followersRepository.findAllByFollowedId(id)

    fun countAllUserFollowers(id: Long): Int = findAllUserFollowers(id).count()

    fun findAllUserFollowing(id: Long): List<User> = followersRepository.findAllByFollowerId(id)

    fun countAllUserFollowing(id: Long): Int = findAllUserFollowing(id).count()
}