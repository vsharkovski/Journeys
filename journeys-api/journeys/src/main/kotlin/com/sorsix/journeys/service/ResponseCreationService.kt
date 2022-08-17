package com.sorsix.journeys.service

import com.sorsix.journeys.api.response.*
import com.sorsix.journeys.domain.Post
import com.sorsix.journeys.domain.PostComment
import com.sorsix.journeys.domain.User
import com.sorsix.journeys.repository.PostCommentRepository
import com.sorsix.journeys.repository.PostLikesRepository
import com.sorsix.journeys.security.service.UserDetailsImpl
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ResponseCreationService(
    val followService: FollowService,
    val likeService: LikeService,
    val commentService: CommentService,
    val postLikesRepository: PostLikesRepository,
    val postCommentRepository: PostCommentRepository,
) {

    fun getAuthenticatedUserId(): Long? =
        when (val authentication = SecurityContextHolder.getContext().authentication) {
            is AnonymousAuthenticationToken -> null
            else -> (authentication.principal as UserDetailsImpl).id
        }

    fun createPublicUser(
        user: User,
        copyRoles: Boolean = false,
        authData: Boolean = false,
        followerCount: Boolean = false,
        followingCount: Boolean = false,
        profilePicture: Boolean = false
    ): PublicUser = PublicUser(
        id = user.id,
        username = user.username,
        roles = if (copyRoles) user.roles.toList() else listOf(),
        authData = if (authData) {
            getAuthenticatedUserId()?.let { id ->
                UserAuthEmbed(following = followService.isUserFollowingUser(id, user.id))
            }
        } else null,
        followerCount = if (followerCount) {
            followService.countAllUserFollowers(user.id)
        } else null,
        followingCount = if (followingCount) {
            followService.countAllUserFollowing(user.id)
        } else null,
        profilePicture = if (profilePicture) {
            user.profilePicture
        } else null
    )

    fun createPublicPost(
        post: Post,
        copyAuthorRoles: Boolean = false,
        authorProfilePicture: Boolean = true,
        authData: Boolean = false,
        countLikes: Boolean = false,
        countComments: Boolean = false,
        fetchComments: Int? = null,
        fetchLocations: Int? = null,
        picture: Boolean = false
    ): PublicPost = PublicPost(
        id = post.id,
        author = createPublicUser(
            post.author,
            copyRoles = copyAuthorRoles,
            authData = authData,
            profilePicture = authorProfilePicture
        ),
        title = post.title,
        description = post.description,
        cost = post.cost,
        costComment = post.costComment,
        timestampCreated = post.timestampCreated.time,
        authData = if (authData) {
            getAuthenticatedUserId()?.let { id ->
                PostAuthEmbed(liked = likeService.doesUserLikePost(id, post.id))
            }
        } else null,
        likeCount = if (countLikes) postLikesRepository.countByPostId(post.id).toInt() else null,
        commentCount = if (countComments) postCommentRepository.countAllByPostId(post.id) else null,
        comments = if (fetchComments != null && fetchComments > 0) {
            val result = if (fetchComments <= 5) {
                commentService.findRecent5PostCommentsOnAPost(post.id)
            } else {
                commentService.findAllPostCommentsOnAPost(post.id)
            }
            result.map {
                createPublicPostComment(
                    it,
                    copyAuthorRoles = copyAuthorRoles,
                    authData = authData,
                    authorProfilePicture = true
                )
            }
        } else null,
        locations = if (fetchLocations != null && fetchLocations > 0) {
            post.locations.map { PublicLocation(it) }
        } else null,
//        images = if (fetchImages != null && fetchImages > 0) {
//            post.images.map { PublicImage(it) }
//        } else null
        picture = if (picture) {
            post.picture
        } else null
    )

    fun createPublicPostComment(
        comment: PostComment,
        copyAuthorRoles: Boolean = false,
        authorProfilePicture: Boolean = false,
        authData: Boolean = false
    ): PublicPostComment = PublicPostComment(
        id = comment.id,
        author = createPublicUser(
            comment.author,
            copyRoles = copyAuthorRoles,
            authData = authData,
            profilePicture = authorProfilePicture
        ),
        postId = comment.postId,
        comment = comment.comment,
        timestampCreated = comment.timestampCreated.time
    )

}