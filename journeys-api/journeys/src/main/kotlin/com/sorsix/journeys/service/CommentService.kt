package com.sorsix.journeys.service

import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.PostCommentRepository
import com.sorsix.journeys.repository.PostRepository
import com.sorsix.journeys.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.sql.Timestamp
import javax.transaction.Transactional

@Service
class CommentService(
    val postCommentRepository: PostCommentRepository,
    val userRepository: UserRepository,
    val postRepository: PostRepository
) {
    private val logger = LoggerFactory.getLogger(FollowService::class.java)

    fun findPostCommentById(id: Long): PostComment? = postCommentRepository.findByIdOrNull(id)

    fun didUserCommentOnPost(userId: Long, postId: Long) =
        postCommentRepository.existsByAuthorIdAndPostId(userId, postId)

    fun findAllUsersThatCommentedOnPost(postId: Long): List<User> =
        postCommentRepository.findAllUsersCommentsOnPost(postId)

    fun findAllPostsCommentedByUser(userId: Long): List<Post> =
        postCommentRepository.findAllPostsCommentedByUser(userId)

    fun findAllPostCommentsOnAPost(postId: Long): List<PostComment> =
        postCommentRepository.findAllByPostIdOrderByTimestampCreatedDesc(postId)

    fun findRecent5PostCommentsOnAPost(postId: Long): List<PostComment> =
        postCommentRepository.findFirst5ByPostIdOrderByTimestampCreatedDesc(postId)

    fun countAllPostCommentsOnAPost(postId: Long): Int = postCommentRepository.countAllByPostId(postId)

    @Transactional
    fun createPostComment(userId: Long, postId: Long, comment: String): PostCommentResult =
        userRepository.findByIdOrNull(userId)?.let { user ->
            postRepository.findByIdOrNull(postId)?.let { post ->
                val postComment =
                    PostComment(
                        0,
                        author = user,
                        postId = post.id,
                        comment = comment,
                        timestampCreated = Timestamp(System.currentTimeMillis())
                    )
                logger.info("Saving comment [{}]", postComment)
                try {
                    PostCommentCreated(postCommentRepository.save(postComment))
                } catch (e: Exception) {
                    logger.error("Error in saving comment [{}]", e.message, e)
                    PostCommentSavingError
                }
                return PostCommentCreated(postComment)
            } ?: PostCommentMissingPostError
        } ?: PostCommentMissingUserError

    fun deletePostComment(id: Long): PostCommentResult = findPostCommentById(id)?.let {
        logger.info("Deleting comment [{}]", it)
        postCommentRepository.delete(it)
        PostCommentDeleted
    } ?: PostCommentNotFoundError
}