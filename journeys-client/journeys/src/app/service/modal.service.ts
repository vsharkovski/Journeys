import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from 'app/components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'app/components/register-modal/register-modal.component';
import { UserListModalComponent } from 'app/components/user-list-modal/user-list-modal.component';
import { Post } from 'app/model/post.model';
import { User } from 'app/model/user.model';
import { FollowService } from './follow.service';
import { LikeService } from './like.service';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(
        private ngbModal: NgbModal,
        private likeService: LikeService,
        private followService: FollowService
    ) {}

    openLoginModal(): void {
        this.ngbModal.open(LoginModalComponent);
    }

    openRegisterModal(): void {
        this.ngbModal.open(RegisterModalComponent);
    }

    openFollowersModal(user: User): void {
        this.followService.getFollowers(user.id).subscribe((followers) => {
            const modal = this.ngbModal.open(UserListModalComponent);
            modal.componentInstance.title = 'Followers';
            modal.componentInstance.users = followers;
        });
    }

    openFollowingModal(user: User): void {
        this.followService.getFollowing(user.id).subscribe((following) => {
            const modal = this.ngbModal.open(UserListModalComponent);
            modal.componentInstance.title = 'Following';
            modal.componentInstance.users = following;
        });
    }

    openLikesModal(post: Post): void {
        this.likeService.getAllLikesOnAPost(post.id).subscribe((likes) => {
            const modal = this.ngbModal.open(UserListModalComponent);
            modal.componentInstance.title = 'Likes';
            modal.componentInstance.users = likes;
        });
    }
}
