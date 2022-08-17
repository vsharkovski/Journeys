import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { Post } from '../../model/post.model';
import { LikeService } from 'app/service/like.service';

@Component({
    selector: 'app-like-unlike-button',
    templateUrl: './like-unlike-button.component.html',
    styleUrls: ['./like-unlike-button.component.css'],
})
export class LikeUnlikeButtonComponent {
    @Input() post?: Post;
    @Input() user?: User;

    @Output() changedPostLikeStatus = new EventEmitter<boolean>();

    constructor(private likeService: LikeService) {}

    onLike() {
        if (this.post && this.user && this.post.authData) {
            this.likeService.likePost(this.post.id).subscribe();
            this.changedPostLikeStatus.emit(true);
        }
    }

    onUnlike() {
        if (this.post && this.user && this.post.authData) {
            this.likeService.unlikePost(this.post.id).subscribe();
            this.changedPostLikeStatus.emit(false);
        }
    }
}
