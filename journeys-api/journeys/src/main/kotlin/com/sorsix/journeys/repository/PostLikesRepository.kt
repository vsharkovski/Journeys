package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Post
import com.sorsix.journeys.domain.PostLikes
import com.sorsix.journeys.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostLikesRepository : JpaRepository<PostLikes, Long> {
    @Query("select u from User u join PostLikes pl on u.id = pl.userId where pl.postId = ?1")
    fun findAllUsersLikesOnPost(postId: Long): List<User>

    @Query("select p from Post p join PostLikes pl on p.id = pl.postId where pl.userId = ?1")
    fun findAllPostsLikedByUser(userId: Long): List<Post>

    fun existsByUserIdAndPostId(userId: Long, postId: Long) : Boolean

    fun deletePostLikesByUserIdAndPostId(userId: Long, postId: Long)

    fun countByPostId(postId: Long): Long
}