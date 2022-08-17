import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private loggedOutUser: User = { id: 0, username: '', roles: [] };
    private userSource = new BehaviorSubject<User | undefined>(undefined);

    constructor() {
        const lastUser = window.sessionStorage.getItem(USER_KEY);
        if (lastUser) {
            this.userSource.next(JSON.parse(lastUser));
        }
    }

    clean(): void {
        window.sessionStorage.clear();
        this.userSource.next(undefined);
    }

    saveUser(user: User): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        this.userSource.next({ ...user });
    }

    getUser(): Observable<User | undefined> {
        return this.userSource.asObservable();
    }
}
