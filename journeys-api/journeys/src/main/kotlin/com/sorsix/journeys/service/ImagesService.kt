package com.sorsix.journeys.service

import ImageCreated
import ImageResult
import ImageSavingError
import com.sorsix.journeys.api.response.PublicImage
import com.sorsix.journeys.domain.*
import com.sorsix.journeys.repository.ImagesRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class ImagesService(
    val imagesRepository: ImagesRepository
) {

    private val logger = LoggerFactory.getLogger(LocationService::class.java)

    fun createImage(picture: MultipartFile?): ImageResult {
        val image = Image(picture = picture?.bytes)
        logger.info("Saving image [{}]", image)
        return try {
            ImageCreated(imagesRepository.save(image))
        } catch (e: Exception) {
            logger.error("Error in saving image [{}]", e.message, e)
            ImageSavingError
        }
    }

    fun processAndCreateImages(images: List<PublicImage>): List<Image> =
        images.mapNotNull {
            if (it.id == 0L) {
                when (val result = createImage(it.picture)) {
                    is ImageCreated -> result.image
                    else -> null
                }
            } else null
        }
}