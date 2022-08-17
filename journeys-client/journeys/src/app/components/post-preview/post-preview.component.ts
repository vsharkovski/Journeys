import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../model/post.model';
import { User } from '../../model/user.model';
import { UserFollowStatus } from '../../model/user-follow-status.model';
import { ModalService } from 'app/service/modal.service';
import { PostComment } from 'app/model/post-comment.model';
@Component({
    selector: 'app-post-preview',
    templateUrl: './post-preview.component.html',
    styleUrls: ['./post-preview.component.css'],
})
export class PostPreviewComponent {
    @Input() post?: Post;
    @Input() user?: User;
    @Input() showAuthorProfilePictures: boolean = true;
    @Output() changedAuthorFollowStatus = new EventEmitter<UserFollowStatus>();

    public isCommentListCollapsed = true;

    constructor(private modalService: ModalService) {}

    onAuthorFollowStatusChange(newStatus: UserFollowStatus): void {
        this.changedAuthorFollowStatus.emit(newStatus);
    }

    onPostLikeStatusChange(newStatus: boolean): void {
        if (this.post?.authData) {
            this.post.authData.liked = newStatus;
        }
        if (this.post?.likeCount != undefined) {
            this.post.likeCount += newStatus ? 1 : -1;
        }
    }

    onCommentsChange(comments: PostComment[]): void {
        if (this.post) {
            this.post.comments = comments;
        }
    }

    openLikesModal(): void {
        if (this.post) {
            this.modalService.openLikesModal(this.post);
        }
    }
}
