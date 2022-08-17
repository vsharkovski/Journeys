import { Response } from './response.model';

export interface LikeResponse extends Response {}

export interface LikeCountResponse extends LikeResponse {
    count: number;
}
