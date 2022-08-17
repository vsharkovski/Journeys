import { Location } from './location.model';
import { PostComment } from './post-comment.model';
import { User } from './user.model';
import { Image } from './image.model';

export interface Post {
    id: number;
    author: User;
    title: string;
    description: string;
    cost: number;
    costComment: string;
    timestampCreated: number;
    timeCreated?: Date;
    likeCount?: number;
    authData?: {
        liked: boolean;
    };
    comments?: PostComment[];
    locations?: Location[];
    images?: Image[];
    picture?: any;
    pictureFormat?: string;
}
