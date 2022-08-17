package com.sorsix.journeys.api.request

import com.sorsix.journeys.api.response.PublicImage
import com.sorsix.journeys.api.response.PublicLocation
import org.hibernate.validator.constraints.Range
import org.springframework.web.multipart.MultipartFile
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreatePostRequest(
    @get:NotBlank
    val title: String,

    @get:NotNull
    val description: String,

    @get:NotNull
    @get:Range(min = 0, max = 10000)
    val totalCost: Int,

    @get:NotNull
    val costComment: String,

    val locations: List<PublicLocation>,

    val image: PublicImage,

    val images: List<PublicImage> = emptyList(),
//    val taggedPeople: List<Long>, TODO

    val files: List<MultipartFile>
)