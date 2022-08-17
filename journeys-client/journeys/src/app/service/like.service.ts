import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from 'app/model/post.model';
import {
    LikeCountResponse,
    LikeResponse,
} from 'app/model/response/like-response.model';
import { PostInfoListResponse } from 'app/model/response/post-response.model';
import { UserInfoListResponse } from 'app/model/response/user-response.model';
import { User } from 'app/model/user.model';
import { catchError, map, Observable } from 'rxjs';
import { CommonService } from './common.service';

const postUrl = 'api/post';

@Injectable({
    providedIn: 'root',
})
export class LikeService {
    constructor(private http: HttpClient, private common: CommonService) {}

    likePost(postId: number): Observable<LikeResponse> {
        return this.http
            .post<LikeResponse>(`${postUrl}/${postId}/like`, '')
            .pipe(
                catchError(
                    this.common.handleError<LikeResponse>('like', {
                        success: false,
                    })
                )
            );
    }

    unlikePost(postId: number): Observable<LikeResponse> {
        return this.http
            .post<LikeResponse>(`${postUrl}/${postId}/unlike`, '')
            .pipe(
                catchError(
                    this.common.handleError<LikeResponse>('unlike', {
                        success: false,
                    })
                )
            );
    }

    getNumberOfLikesOnAPost(postId: number): Observable<number> {
        return this.http
            .get<LikeCountResponse>(`${postUrl}/${postId}/likes_num`)
            .pipe(
                catchError(
                    this.common.handleError<LikeCountResponse>(
                        'getLikesNumber',
                        { success: false, count: 0 }
                    )
                ),
                map((response) => response.count)
            );
    }

    getAllLikesOnAPost(postId: number): Observable<User[]> {
        return this.http
            .get<UserInfoListResponse>(`${postUrl}/${postId}/likes`)
            .pipe(
                catchError(
                    this.common.handleError<UserInfoListResponse>(
                        'getAllLikesOnAPost',
                        { success: false, users: [] }
                    )
                ),
                map((response) => response.users)
            );
    }

    getLikedPostsByUserId(
        userId: number,
        authData: boolean = false,
        countLikes: boolean = false,
        countComments: boolean = false,
        fetchComments?: number,
        fetchLocations?: number
    ): Observable<Post[]> {
        return this.http
            .get<PostInfoListResponse>(`${postUrl}/${userId}/posts_liked`, {
                params: this.common.createHttpParams({
                    authData,
                    countLikes,
                    countComments,
                    fetchComments,
                    fetchLocations,
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<PostInfoListResponse>(
                        'getLikedPostsByUser',
                        { success: false, posts: [] }
                    )
                ),
                map((response) => response.posts)
            );
    }
}
