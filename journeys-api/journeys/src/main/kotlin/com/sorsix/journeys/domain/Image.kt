package com.sorsix.journeys.domain

import javax.persistence.*

@Entity
@Table(name = "images")
data class Image(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val picture: ByteArray? = null,

    @ManyToMany(mappedBy = "images", fetch = FetchType.LAZY)
    val posts: Set<Post> = setOf()
) {
    override fun toString(): String = "Image(id=$id, postIds=${posts.map { it.id }})"
}