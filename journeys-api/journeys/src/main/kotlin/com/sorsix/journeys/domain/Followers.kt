package com.sorsix.journeys.domain

import javax.persistence.*
@Entity
@Table(name = "followers")
data class Followers(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(name = "follower_id")
    val followerId: Long,

    @Column(name = "followed_id")
    val followedId: Long
)