package com.sorsix.journeys.domain

import java.sql.Timestamp
import javax.persistence.*

@Entity
@Table(name = "post_comments")
data class PostComment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val author: User,

    @Column(name = "post_id")
    val postId: Long,

    @Column
    val comment: String,

    @Column
    val timestampCreated: Timestamp
)