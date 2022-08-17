package com.sorsix.journeys.domain

sealed interface PostLikeResult

data class PostLike(val postLike: PostLikes) : PostLikeResult

data class PostUnlike(val postId: Long, val userId: Long) : PostLikeResult

object AlreadyLikedError : PostLikeResult

object PostLikeError : PostLikeResult

object PostUnlikeError : PostLikeResult

object NotLikedError : PostLikeResult