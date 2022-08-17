package com.sorsix.journeys.domain

sealed interface FollowersResult

data class FollowerFollow(val follower: Followers) : FollowersResult

data class FollowerUnfollow(val followerId: Long, val followedId: Long) : FollowersResult

object FollowedUserNotFound : FollowersResult

object AlreadyFollowingError : FollowersResult

object NotFollowingError : FollowersResult

object FollowerFollowError : FollowersResult

object FollowerUnfollowError : FollowersResult

object SelfFollowError : FollowersResult

object SelfUnfollowError : FollowersResult