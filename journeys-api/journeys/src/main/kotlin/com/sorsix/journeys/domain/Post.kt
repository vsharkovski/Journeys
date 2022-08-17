package com.sorsix.journeys.domain

import java.sql.Timestamp
import javax.persistence.*

@Entity
data class Post(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val author: User,

    val title: String,

    val description: String,

    val cost: Int,

    val costComment: String,

    val timestampCreated: Timestamp,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "post_locations",
        joinColumns = [JoinColumn(name = "post_id")],
        inverseJoinColumns = [JoinColumn(name = "location_id")],
    )
    val locations: List<Location> = listOf(),

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "post_images",
        joinColumns = [JoinColumn(name = "post_id")],
        inverseJoinColumns = [JoinColumn(name = "image_id")],
    )
    val images: List<Image> = listOf(),

    val picture: ByteArray? = null,

    @Transient
    val pictureFormat: String? = null
) {
    override fun toString(): String =
        "Post(id=$id, author=$author, title=$title, description=$description, cost=$cost, costComment=$costComment, timestampCreated=$timestampCreated, locationIds=${locations.map { it.id }})"
}