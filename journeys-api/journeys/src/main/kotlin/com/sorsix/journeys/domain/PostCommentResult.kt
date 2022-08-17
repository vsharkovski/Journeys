package com.sorsix.journeys.domain

sealed interface PostCommentResult

data class PostCommentCreated(val postComment: PostComment) : PostCommentResult

object PostCommentNotFoundError : PostCommentResult

object PostCommentSavingError : PostCommentResult

object PostCommentMissingUserError : PostCommentResult

object PostCommentDeleted : PostCommentResult

object PostCommentMissingPostError : PostCommentResult

