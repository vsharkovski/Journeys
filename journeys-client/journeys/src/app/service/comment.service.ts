import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreatePostCommentRequest } from '../model/create-post-comment-request';
import { PostComment } from '../model/post-comment.model';
import {
    PostCommentInfoResponse,
    PostCommentsInfoListResponse,
} from '../model/response/post-comment.response';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { MessageResponse } from 'app/model/response/response.model';

const postCommentUrl = 'api/post';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(private http: HttpClient, private common: CommonService) {}

    addComment(
        comment: CreatePostCommentRequest,
        postId: number
    ): Observable<PostComment | undefined> {
        return this.http
            .post<PostCommentInfoResponse>(
                `${postCommentUrl}/${postId}/comment`,
                comment
            )
            .pipe(
                catchError(
                    this.common.handleError<PostCommentInfoResponse>(
                        'addPostComment',
                        {
                            success: false,
                            postComment: undefined,
                        }
                    )
                ),
                map((response) => response.postComment)
            );
    }

    getCommentsOnPost(id: number): Observable<PostComment[]> {
        return this.http
            .get<PostCommentsInfoListResponse>(
                `${postCommentUrl}/${id}/comments`
            )
            .pipe(
                catchError(
                    this.common.handleError<PostCommentsInfoListResponse>(
                        'getPostComments',
                        { success: false, postComments: [] }
                    )
                ),
                map((response) => response.postComments)
            );
    }

    deleteComment(
        postId: number,
        commentId: number
    ): Observable<MessageResponse> {
        return this.http
            .delete<MessageResponse>(
                `${postCommentUrl}/${postId}/comment/${commentId}`
            )
            .pipe(
                catchError(
                    this.common.handleError<MessageResponse>('deleteComment', {
                        success: false,
                        message: 'Internal error',
                    })
                )
            );
    }
}
