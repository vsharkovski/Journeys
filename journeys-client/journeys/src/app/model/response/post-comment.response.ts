import { Response } from './response.model';
import { PostComment } from '../post-comment.model';

export interface PostCommentInfoResponse extends Response {
    postComment?: PostComment;
}

export interface PostCommentsInfoListResponse extends Response {
    postComments: PostComment[];
}
