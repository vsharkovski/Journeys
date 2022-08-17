package com.sorsix.journeys.domain

import javax.persistence.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@Entity
data class Location(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @NotBlank
    @Size(max = 20)
    val name: String,

    val latitude: Float,

    val longitude: Float,

    @ManyToMany(mappedBy = "locations", fetch = FetchType.LAZY)
    val posts: Set<Post> = setOf()
)