import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthUserInfoResponse } from '../model/response/auth-response.model';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
import { MessageResponse } from '../model/response/response.model';
import { StorageService } from './storage.service';
import { AuthMessage } from '../model/auth-message.model';

const AUTH_API = 'api/auth';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private loginMessageSource = new Subject<AuthMessage>();
    private registerMessageSource = new Subject<AuthMessage>();

    constructor(
        private http: HttpClient,
        private common: CommonService,
        private storage: StorageService
    ) {}

    getLoginMessages(): Observable<AuthMessage> {
        return this.loginMessageSource.asObservable();
    }

    getRegisterMessages(): Observable<AuthMessage> {
        return this.registerMessageSource.asObservable();
    }

    register(
        username: string,
        email: string,
        password: string,
        profilePicture?: File
    ): void {
        const formData: FormData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        if (profilePicture) formData.append('profilePicture', profilePicture);
        this.http
            .post<MessageResponse>(
                `${AUTH_API}/sign_up`,
                formData
            )
            .pipe(
                catchError(
                    this.common.handleError<MessageResponse>('register', {
                        success: false,
                        message: 'Unknown error',
                    })
                )
            )
            .subscribe((response) => {
                if (response.success) {
                    this.registerMessageSource.next({
                        success: true,
                        message: '',
                    });
                } else {
                    this.registerMessageSource.next({
                        success: false,
                        message: response.message,
                    });
                }
            });
    }

    login(username: string, password: string): void {
        this.http
            .post<AuthUserInfoResponse | MessageResponse>(
                `${AUTH_API}/sign_in`,
                { username, password },
                httpOptions
            )
            .pipe(
                catchError(
                    this.common.handleError<MessageResponse>('login', {
                        success: false,
                        message: 'Unknown error',
                    })
                )
            )
            .subscribe((response) => {
                if (response.success) {
                    const userInfo = response as AuthUserInfoResponse;
                    this.storage.saveUser({
                        id: userInfo.id,
                        username: userInfo.username,
                        roles: userInfo.roles,
                    });
                    this.loginMessageSource.next({
                        success: true,
                        message: 'Login successful',
                    });
                } else {
                    this.loginMessageSource.next({
                        success: false,
                        message: (response as MessageResponse).message,
                    });
                }
            });
    }

    logout(): void {
        this.storage.clean();
        this.http
            .post<MessageResponse>(`${AUTH_API}/sign_out`, {}, httpOptions)
            .pipe(
                catchError(
                    this.common.handleError<MessageResponse>('logout', {
                        success: false,
                        message: 'Unknown error',
                    })
                )
            )
            .subscribe();
    }
}
