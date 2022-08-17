package com.sorsix.journeys.api.response

import com.sorsix.journeys.domain.Image
import com.sorsix.journeys.service.BASE64DecodedMultipartFile
import org.springframework.web.multipart.MultipartFile

data class PublicImage(
    val id: Long,
    val picture: MultipartFile?
) {
    constructor(image: Image) : this(
        id = image.id,
        picture = image.picture?.let { BASE64DecodedMultipartFile(it) }
    )
}