import { Post } from '../post.model';
import { Response } from './response.model';

export interface PostInfoResponse extends Response {
    post?: Post;
}

export interface PostInfoListResponse extends Response {
    posts: Post[];
}

export interface PostInfoCountResponse extends Response {
    num: number;
}
