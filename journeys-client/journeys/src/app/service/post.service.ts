import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../model/post.model';
import { CommonService } from './common.service';
import {
    PostInfoListResponse,
    PostInfoResponse,
} from '../model/response/post-response.model';
import { CreatePostRequest } from '../model/create-post-request.model';
import { MessageResponse } from '../model/response/response.model';

const postUrl = 'api/post';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(private http: HttpClient, private common: CommonService) {}

    addPost(post: CreatePostRequest): Observable<Post | undefined> {
        const formData: FormData = new FormData();
        formData.append('title', post.title);
        formData.append('description', post.description);
        formData.append('totalCost', post.totalCost.toString());
        formData.append('costComment', post.costComment);
        formData.append('locations', JSON.stringify(post.locations));
        if (post.picture) {
            formData.append('picture', post.picture);
        }
        return this.http.post<PostInfoResponse>(postUrl, formData).pipe(
            catchError(
                this.common.handleError<PostInfoResponse>('addPost', {
                    success: false,
                    post: undefined,
                })
            ),
            map((response) => response.post)
        );
    }

    getPosts(
        onlyFollowed: boolean = false,
        authData: boolean = false,
        countLikes: boolean = false,
        countComments: boolean = false,
        fetchComments?: number,
        fetchLocations?: number
    ): Observable<Post[]> {
        return this.http
            .get<PostInfoListResponse>(postUrl, {
                params: this.common.createHttpParams({
                    onlyFollowed,
                    authData,
                    countLikes,
                    countComments,
                    fetchComments,
                    fetchLocations,
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<PostInfoListResponse>('getPosts', {
                        success: false,
                        posts: [],
                    })
                ),
                map((response) => response.posts)
            );
    }

    getPostById(
        id: number,
        authData: boolean = false,
        countLikes: boolean = false,
        countComments: boolean = false,
        fetchComments?: number,
        fetchLocations?: number
    ): Observable<Post | undefined> {
        return this.http
            .get<PostInfoResponse>(`${postUrl}/${id}`, {
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
                    this.common.handleError<PostInfoResponse>('getPostById', {
                        success: false,
                        post: undefined,
                    })
                ),
                map((response) => response.post)
            );
    }

    getPostsByUserId(
        userId: number,
        authData: boolean = false,
        countLikes: boolean = false,
        countComments: boolean = false,
        fetchComments?: number,
        fetchLocations?: number
    ): Observable<Post[]> {
        return this.http
            .get<PostInfoListResponse>(`${postUrl}/user/${userId}`, {
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
                        'getPostsByUser',
                        { success: false, posts: [] }
                    )
                ),
                map((response) => response.posts)
            );
    }

    deletePost(postId: number): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${postUrl}/${postId}`).pipe(
            catchError(
                this.common.handleError<MessageResponse>('deletePost', {
                    success: false,
                    message: 'Internal error',
                })
            )
        );
    }
}
