import { User } from './user.model';

export interface PostComment {
    id: number;
    author: User;
    postId: number;
    comment: string;
    timestampCreated: number;
}
