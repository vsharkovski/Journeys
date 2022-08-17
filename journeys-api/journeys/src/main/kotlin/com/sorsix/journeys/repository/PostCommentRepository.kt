package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Post
import com.sorsix.journeys.domain.PostComment
import com.sorsix.journeys.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostCommentRepository : JpaRepository<PostComment, Long> {
    @Query("select u from User u join PostComment pc on u.id = pc.author.id where pc.postId = ?1")
    fun findAllUsersCommentsOnPost(postId: Long): List<User>

    @Query("select p from Post p join PostComment pc on p.id = pc.postId where pc.author.id = ?1")
    fun findAllPostsCommentedByUser(userId: Long): List<Post>

    fun existsByAuthorIdAndPostId(userId: Long, postId: Long): Boolean

    fun findAllByPostIdOrderByTimestampCreatedDesc(postId: Long): List<PostComment>

    fun countAllByPostId(postId: Long): Int

    fun findFirst5ByPostIdOrderByTimestampCreatedDesc(postId: Long): List<PostComment>
}