import { Post } from '../post.model';
import { User } from '../user.model';
import { Response } from './response.model';

export interface SearchResponse extends Response {}

export interface SearchPostsUsersResponse extends SearchResponse {
    users: User[];
    posts: Post[];
}

export interface SearchPostsResponse extends SearchResponse {
    posts: Post[];
}
