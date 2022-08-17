export interface User {
    id: number;
    username: string;
    roles: string[];
    authData?: {
        following: boolean;
    };
    followerCount?: number;
    followingCount?: number;
    profilePicture?: any;
    profilePictureFormat?: string;
}
