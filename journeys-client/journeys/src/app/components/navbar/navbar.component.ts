import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../service/storage.service';
import { User } from '../../model/user.model';
import { Subscription } from 'rxjs';
import { ModalService } from 'app/service/modal.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
    user?: User;
    userSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.storageService
            .getUser()
            .subscribe((user) => (this.user = user));
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    onLogout(): void {
        this.authService.logout();
    }

    openLoginModal(): void {
        this.modalService.openLoginModal();
    }

    openRegisterModal(): void {
        this.modalService.openRegisterModal();
    }
}
