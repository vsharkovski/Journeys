package com.sorsix.journeys.domain

import javax.persistence.*

@Entity
@Table(name = "post_likes")
data class PostLikes(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(name = "user_id")
    val userId: Long,

    @Column(name = "post_id")
    val postId: Long
)