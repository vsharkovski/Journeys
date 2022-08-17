import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/model/user.model';

@Component({
    selector: 'app-user-list-modal',
    templateUrl: './user-list-modal.component.html',
    styleUrls: ['./user-list-modal.component.css'],
})
export class UserListModalComponent {
    @Input() title!: string;
    @Input() users: User[] = [];
    constructor(public activeModal: NgbActiveModal) {}
}
