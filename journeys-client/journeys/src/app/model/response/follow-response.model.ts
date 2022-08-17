import { Response } from './response.model';

export interface FollowResponse extends Response {}

export interface FollowCountResponse extends FollowResponse {
    count: number;
}
