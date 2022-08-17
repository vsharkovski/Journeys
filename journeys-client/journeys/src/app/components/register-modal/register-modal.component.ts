import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthMessage } from 'app/model/auth-message.model';
import { AuthService } from 'app/service/auth.service';
import { ModalService } from 'app/service/modal.service';
import { Subscription } from 'rxjs';
import { CreateUserRequest } from '../../model/create-user-request.model';

@Component({
    selector: 'app-register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.css'],
})
export class RegisterModalComponent implements OnInit {
    lastMessage?: AuthMessage;
    lastMessageSubscription?: Subscription;

    form = new FormGroup({
        username: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
        ]),
        email: new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.maxLength(50),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
        ]),
        profilePicture: new FormControl(),
    });

    constructor(
        private authService: AuthService,
        private modalService: ModalService,
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.lastMessageSubscription = this.authService
            .getRegisterMessages()
            .subscribe((message) => (this.lastMessage = message));
    }

    ngOnDestroy() {
        this.lastMessageSubscription?.unsubscribe();
    }

    onSubmit(): void {
        if (!this.form.valid) {
            return;
        }
        let user = this.form.value as CreateUserRequest;
        user.profilePicture = this.form.get('profilePicture')?.value;
        this.authService.register(
            user.username,
            user.email,
            user.password,
            user.profilePicture
        );
    }

    openLoginModal(): void {
        this.activeModal.close();
        this.modalService.openLoginModal();
    }

    get emailField(): AbstractControl {
        return this.form.get('email')!;
    }

    get usernameField(): AbstractControl {
        return this.form.get('username')!;
    }

    get passwordField(): AbstractControl {
        return this.form.get('password')!;
    }

    onFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files![0];
        this.form.patchValue({
            profilePicture: file,
        });
    }
}
