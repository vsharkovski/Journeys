import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthMessage } from 'app/model/auth-message.model';
import { AuthService } from 'app/service/auth.service';
import { StorageService } from 'app/service/storage.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements OnInit {
    userSubscription?: Subscription;

    lastMessage?: AuthMessage;
    loginMessageSubscription?: Subscription;

    form = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private storage: StorageService,
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.storage.getUser().subscribe((user) => {
            if (user) {
                this.activeModal.close();
            }
        });
        this.loginMessageSubscription = this.authService
            .getLoginMessages()
            .subscribe((message) => (this.lastMessage = message));
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
        this.loginMessageSubscription?.unsubscribe();
    }

    onSubmit(): void {
        const { username, password } = this.form.value;
        if (!this.form.valid || !username || !password) {
            return;
        }
        this.authService.login(username, password);
    }

    get usernameField(): AbstractControl {
        return this.form.get('username')!;
    }

    get passwordField(): AbstractControl {
        return this.form.get('password')!;
    }
}
