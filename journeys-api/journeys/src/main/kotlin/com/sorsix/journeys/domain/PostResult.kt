package com.sorsix.journeys.domain

sealed interface PostResult

data class PostCreated(val post: Post) : PostResult

object PostDeleted : PostResult

object PostDeletionError : PostResult

object PostNotFoundError : PostResult

object PostSavingError : PostResult

object PostMissingUserError : PostResult
