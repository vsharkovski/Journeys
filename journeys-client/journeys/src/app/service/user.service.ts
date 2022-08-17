import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../model/user.model';
import {
    UserInfoListResponse,
    UserInfoResponse,
} from '../model/response/user-response.model';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';

const userUrl = 'api/users';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient, private common: CommonService) {}

    getUsers(
        authData: boolean = false,
        followerCount: boolean = false,
        followingCount: boolean = false
    ): Observable<User[]> {
        return this.http
            .get<UserInfoListResponse>(`${userUrl}`, {
                params: this.common.createHttpParams({
                    authData,
                    followerCount,
                    followingCount,
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<UserInfoListResponse>(
                        'getAllUsers',
                        {
                            success: false,
                            users: [],
                        }
                    )
                ),
                map((response) => response.users)
            );
    }

    getUserById(
        userId: number,
        authData: boolean = false,
        followerCount: boolean = false,
        followingCount: boolean = false
    ): Observable<User | undefined> {
        return this.http
            .get<UserInfoResponse>(`${userUrl}/${userId}`, {
                params: this.common.createHttpParams({
                    authData,
                    followerCount,
                    followingCount,
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<UserInfoResponse>('getUserById', {
                        success: false,
                        user: undefined,
                    })
                ),
                map((response) => response.user)
            );
    }
}
