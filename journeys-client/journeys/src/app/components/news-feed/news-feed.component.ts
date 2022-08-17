import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../model/post.model';
import { PostService } from '../../service/post.service';
import { forkJoin, of, Subscription, switchMap } from 'rxjs';
import { User } from '../../model/user.model';
import { StorageService } from '../../service/storage.service';
import { UserFollowStatus } from '../../model/user-follow-status.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-news-feed',
    templateUrl: './news-feed.component.html',
    styleUrls: ['./news-feed.component.css'],
})
export class NewsFeedComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    user?: User;
    title: string = 'Journeys';

    userSubscription?: Subscription;
    postsSubscription?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private postService: PostService,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.storageService
            .getUser()
            .subscribe((user) => (this.user = user));
        this.postsSubscription = this.storageService
            .getUser()
            .pipe(
                switchMap((user) =>
                    this.route.data.pipe(
                        switchMap((data) => {
                            const title =
                                data['title'] && user
                                    ? data['title']
                                    : 'Journeys';
                            const onlyFollowed: boolean =
                                data['onlyFollowedUsers'] != null &&
                                data['onlyFollowedUsers'] === true &&
                                user != undefined;
                            return forkJoin([
                                of(title),
                                // prettier-ignore
                                this.postService.getPosts(onlyFollowed, true, true, true, 5),
                            ]);
                        })
                    )
                )
            )
            .subscribe((result) => {
                this.title = result[0];
                this.posts = result[1];
            });
    }

    ngOnDestroy(): void {
        this.postsSubscription?.unsubscribe();
        this.userSubscription?.unsubscribe();
    }

    onAuthorFollowStatusChange(status: UserFollowStatus): void {
        for (let post of this.posts) {
            if (post.author.id == status.id && post.author.authData) {
                post.author.authData.following = status.status;
            }
        }
    }
}
