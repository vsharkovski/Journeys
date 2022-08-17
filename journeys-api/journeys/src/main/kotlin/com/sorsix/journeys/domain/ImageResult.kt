import com.sorsix.journeys.domain.Image

sealed interface ImageResult

data class ImageCreated(val image: Image) : ImageResult

object ImageSavingError : ImageResult