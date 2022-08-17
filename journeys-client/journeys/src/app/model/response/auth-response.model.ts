import { Response } from './response.model';

export interface AuthUserInfoResponse extends Response {
    id: number;
    username: string;
    email: string;
    roles: string[];
}
