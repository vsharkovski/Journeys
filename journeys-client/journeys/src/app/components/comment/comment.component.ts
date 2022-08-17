import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/model/user.model';
import { CommentService } from 'app/service/comment.service';
import { PostComment } from '../../model/post-comment.model';
@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
    @Input() comment!: PostComment;
    @Input() loggedUser?: User;
    @Output() deleted = new EventEmitter<void>();

    constructor(private commentService: CommentService) {}

    deleteComment(): void {
        if (this.loggedUser && this.comment.author.id === this.loggedUser.id) {
            this.commentService
                .deleteComment(this.comment.postId, this.comment.id)
                .subscribe();
            this.deleted.next();
        }
    }
}
