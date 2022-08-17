import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../model/post.model';
import { of, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../service/post.service';
import { User } from '../../model/user.model';
import { StorageService } from '../../service/storage.service';
import { UserFollowStatus } from 'app/model/user-follow-status.model';
import { ModalService } from 'app/service/modal.service';

@Component({
    selector: 'app-post-detail',
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
    post?: Post;
    user?: User;

    postSubscription?: Subscription;
    userSubscription?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService,
        private postService: PostService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.storageService
            .getUser()
            .subscribe((user) => (this.user = user));
        this.postSubscription = this.storageService
            .getUser()
            .pipe(
                switchMap(() => this.route.paramMap),
                switchMap((params) => {
                    const id = params.get('id');
                    // prettier-ignore
                    return id
                        ? this.postService.getPostById(+id, true, true, true, 50, 50)
                        : of(undefined);
                })
            )
            .subscribe((post) => {
                if (!post) {
                    this.router.navigate(['/not-found']);
                }
                this.post = post;
            });
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
        this.postSubscription?.unsubscribe();
    }

    onDeletePost(): void {
        if (this.post) {
            this.postService.deletePost(this.post.id).subscribe();
            this.router.navigate(['/']);
        }
    }

    onPostLikeStatusChange(newStatus: boolean): void {
        if (this.post?.authData) {
            this.post.authData.liked = newStatus;
        }
        if (this.post?.likeCount != undefined) {
            this.post.likeCount += newStatus ? 1 : -1;
        }
    }

    onAuthorFollowStatusChange(status: UserFollowStatus): void {
        if (this.post?.author.authData) {
            this.post.author.authData.following = status.status;
        }
    }

    openLikesModal(): void {
        if (this.post) {
            this.modalService.openLikesModal(this.post);
        }
    }
}
