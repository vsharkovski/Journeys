package com.sorsix.journeys.domain

import javax.persistence.*

@Entity
@Table(name = "roles")
data class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    val name: ERole,
)

// Possible improvement for later:
// https://www.baeldung.com/jpa-persisting-enums-in-jpa
