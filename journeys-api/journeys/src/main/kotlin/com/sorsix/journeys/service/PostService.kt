package com.sorsix.journeys.service

import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.PostRepository
import com.sorsix.journeys.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.sql.Timestamp
import javax.transaction.Transactional

@Service
class PostService(
    val postRepository: PostRepository,
    val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(PostService::class.java)

    fun findAllPosts(): List<Post> = postRepository.findAllByOrderByTimestampCreatedDesc()

    fun findPostById(id: Long): Post? = postRepository.findByIdOrNull(id)

    fun findPostsByUserId(id: Long): List<Post> = postRepository.findByUserId(id)

    fun findPostsByTitleLike(term: String): List<Post> =
        this.postRepository.findByTitleContainingIgnoreCaseOrderByTimestampCreatedDesc(term)

    fun findPostsFromFollowedAuthors(followerId: Long): List<Post> =
        postRepository.findFromFollowedAuthors(followerId)

    fun findPostsComplex(term: String, minCost: Int, maxCost: Int, locations: List<Location>): List<Post> =
        if (locations.isEmpty()) {
            postRepository.findComplex(term, minCost, maxCost)
        } else {
            postRepository.findComplex(term, minCost, maxCost).filter { post ->
                locations.any { location ->
                    post.locations.contains(location)
                }
            }
        }

    @Transactional
    fun createPost(
        userId: Long,
        title: String,
        description: String,
        cost: Int,
        costComment: String,
        locations: List<Location>,
        // images: List<Image>,
        picture: MultipartFile?
    ): PostResult =
        userRepository.findByIdOrNull(userId)?.let { user ->
            val post = Post(
                author = user,
                title = title,
                description = description,
                cost = cost,
                costComment = costComment,
                timestampCreated = Timestamp(System.currentTimeMillis()),
                locations = locations,
                images = emptyList(),
                picture = picture?.bytes,
                pictureFormat = picture?.contentType,
            )
            logger.info("Saving post [{}]", post)
            try {
                PostCreated(postRepository.save(post))
            } catch (e: Exception) {
                logger.error("Error in saving post [{}]", e.message, e)
                PostSavingError
            }
        } ?: PostMissingUserError

    fun deletePost(id: Long): PostResult = findPostById(id)?.let {
        postRepository.delete(it)
        PostDeleted
    } ?: PostNotFoundError
}

