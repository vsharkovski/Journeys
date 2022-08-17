package com.sorsix.journeys.service

import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.PostLikesRepository
import com.sorsix.journeys.security.service.UserDetailsImpl
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
class LikeService(
    val postLikesRepository: PostLikesRepository
) {
    private val logger = LoggerFactory.getLogger(FollowService::class.java)

    fun doesUserLikePost(userId: Long, postId: Long) = postLikesRepository.existsByUserIdAndPostId(userId, postId)

    @Transactional
    fun likePost(postId: Long): PostLikeResult {
        val user = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        return if (doesUserLikePost(user.id, postId))
            AlreadyLikedError
        else {
            val postLike = PostLikes(0, userId = user.id, postId = postId)
            logger.info("Saving post like [{}]", postLike)
            return try {
                PostLike(postLikesRepository.save(postLike))
            } catch (e: Exception) {
                logger.error("Error in saving post like [{}]", e.message, e)
                PostLikeError
            }
        }
    }

    @Transactional
    fun unlikePost(postId: Long): PostLikeResult {
        val user = SecurityContextHolder.getContext().authentication.principal as UserDetailsImpl
        return if (!doesUserLikePost(user.id, postId))
            NotLikedError
        else {
            try {
                logger.info("Deleting post like with post id [{}] and user id [{}]", postId, user.id)
                postLikesRepository.deletePostLikesByUserIdAndPostId(user.id, postId)
                PostUnlike(postId, user.id)
            } catch (e: Exception) {
                logger.error("Error in deleting post like [{}]", e.message, e)
                PostUnlikeError
            }
        }
    }

    fun findAllUsersThatLikedThePost(postId: Long): List<User> = postLikesRepository.findAllUsersLikesOnPost(postId)

    fun countAllUsersThatLikedThePost(postId: Long): Int = findAllUsersThatLikedThePost(postId).count()

    fun findAllPostsLikedByUser(userId: Long): List<Post> = postLikesRepository.findAllPostsLikedByUser(userId)

    fun countAllPostsLikedByUser(userId: Long): Int = findAllPostsLikedByUser(userId).count()
}