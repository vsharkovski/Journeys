package com.sorsix.journeys.repository

import com.sorsix.journeys.domain.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Post, Long> {
    fun findAllByOrderByTimestampCreatedDesc(): List<Post>

    @Query("select p from Post p where p.author.id = ?1 order by p.timestampCreated desc")
    fun findByUserId(userId: Long): List<Post>

    fun findByTitleContainingIgnoreCaseOrderByTimestampCreatedDesc(term: String): List<Post>

    @Query("""
        select p
        from Post p
            join Followers f
                on p.author.id = f.followedId
        where f.followerId = ?1
        order by p.timestampCreated desc
        """)
    fun findFromFollowedAuthors(followerId: Long): List<Post>

    @Query("""
        select p
        from Post p
        where (p.cost between ?2 and ?3)
            and (lower(p.title) like lower(concat('%', ?1, '%')) or lower(p.description) like lower(concat('%', ?1, '%')))
        order by p.timestampCreated desc
    """)
    fun findComplex(term: String, minCost: Int, maxCost: Int): List<Post>
}