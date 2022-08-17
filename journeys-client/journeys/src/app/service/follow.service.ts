import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
    FollowCountResponse,
    FollowResponse,
} from '../model/response/follow-response.model';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
import { UserInfoListResponse } from '../model/response/user-response.model';
import { User } from '../model/user.model';

const followUrl = 'api/users';

@Injectable({
    providedIn: 'root',
})
export class FollowService {
    constructor(private http: HttpClient, private common: CommonService) {}

    followUser(userId: number): Observable<FollowResponse> {
        return this.http
            .post<FollowResponse>(`${followUrl}/${userId}/follow`, '')
            .pipe(
                catchError(
                    this.common.handleError<FollowResponse>('follow', {
                        success: false,
                    })
                ),
                map((response) => response)
            );
    }

    unfollowUser(userId: number): Observable<FollowResponse> {
        return this.http
            .post<FollowResponse>(`${followUrl}/${userId}/unfollow`, '')
            .pipe(
                catchError(
                    this.common.handleError<FollowResponse>('unfollow', {
                        success: false,
                    })
                ),
                map((response) => response)
            );
    }

    getFollowers(userId: number): Observable<User[]> {
        return this.http
            .get<UserInfoListResponse>(`${followUrl}/${userId}/followers`)
            .pipe(
                catchError(
                    this.common.handleError<UserInfoListResponse>(
                        'getFollowers',
                        { success: false, users: [] }
                    )
                ),
                map((response) => response.users)
            );
    }

    getFollowing(userId: number): Observable<User[]> {
        return this.http
            .get<UserInfoListResponse>(`${followUrl}/${userId}/following`)
            .pipe(
                catchError(
                    this.common.handleError<UserInfoListResponse>(
                        'getFollowing',
                        { success: false, users: [] }
                    )
                ),
                map((response) => response.users)
            );
    }

    getNumberOfFollowers(userId: number): Observable<number> {
        return this.http
            .get<FollowCountResponse>(`${followUrl}/${userId}/followers_num`)
            .pipe(
                catchError(
                    this.common.handleError<FollowCountResponse>(
                        'getFollowersNumber',
                        { success: false, count: 0 }
                    )
                ),
                map((response) => response.count)
            );
    }

    getNumberOfFollowing(userId: number): Observable<number> {
        return this.http
            .get<FollowCountResponse>(`${followUrl}/${userId}/following_num`)
            .pipe(
                catchError(
                    this.common.handleError<FollowCountResponse>(
                        'getFollowingNumber',
                        { success: false, count: 0 }
                    )
                ),
                map((response) => response.count)
            );
    }
}
