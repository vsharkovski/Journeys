import { User } from '../user.model';
import { Response } from './response.model';

export interface UserInfoResponse extends Response {
    user?: User;
}

export interface UserInfoListResponse extends Response {
    users: User[];
}

export interface UserInfoCountResponse extends Response {
    num: number;
}
