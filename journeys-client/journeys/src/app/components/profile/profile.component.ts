import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { merge, of, Subscription, switchMap } from 'rxjs';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../service/post.service';
import { StorageService } from '../../service/storage.service';
import { Post } from '../../model/post.model';
import { UserFollowStatus } from 'app/model/user-follow-status.model';
import { ModalService } from 'app/service/modal.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    user?: User;
    loggedUser?: User;
    posts: Post[] = [];

    loggedUserSubscription?: Subscription;
    postsSubscription?: Subscription;
    userSubscription?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService,
        private userService: UserService,
        private postService: PostService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.loggedUserSubscription = this.storageService
            .getUser()
            .subscribe((user) => (this.loggedUser = user));
        const loggedUserOrRouteChanged = merge(
            this.storageService.getUser(),
            this.route.paramMap
        );
        this.userSubscription = loggedUserOrRouteChanged
            .pipe(
                switchMap(() => {
                    const id = this.route.snapshot.paramMap.get('id');
                    return id
                        ? this.userService.getUserById(+id, true, true, true)
                        : of(undefined);
                })
            )
            .subscribe((user) => {
                if (!user) {
                    this.router.navigate(['/not-found']);
                }
                this.user = user;
            });
        this.postsSubscription = loggedUserOrRouteChanged
            .pipe(
                switchMap(() => {
                    const id = this.route.snapshot.paramMap.get('id');
                    // prettier-ignore
                    return id
                        ? this.postService.getPostsByUserId(+id, true, true, true, 5)
                        : of(undefined);
                })
            )
            .subscribe((posts) => (this.posts = posts ?? []));
    }

    ngOnDestroy(): void {
        this.loggedUserSubscription?.unsubscribe();
        this.userSubscription?.unsubscribe();
        this.postsSubscription?.unsubscribe();
    }

    onAuthorFollowStatusChange(status: UserFollowStatus): void {
        if (this.user) {
            if (this.user.authData) {
                this.user.authData.following = status.status;
            }
            if (status.status) {
                this.user.followerCount! += 1;
            } else {
                this.user.followerCount! -= 1;
            }
        }
    }

    openFollowersModal(): void {
        if (this.user) {
            this.modalService.openFollowersModal(this.user);
        }
    }

    openFollowingModal(): void {
        if (this.user) {
            this.modalService.openFollowingModal(this.user);
        }
    }
}
