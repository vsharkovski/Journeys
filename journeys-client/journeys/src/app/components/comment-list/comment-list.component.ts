import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { User } from '../../model/user.model';
import { CommentService } from '../../service/comment.service';
import { PostComment } from '../../model/post-comment.model';
import { Subscription } from 'rxjs';
import { Post } from '../../model/post.model';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { CreatePostCommentRequest } from '../../model/create-post-comment-request';

@Component({
    selector: 'app-comments-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css'],
})
export class CommentListComponent implements OnInit, OnDestroy {
    @Input() loggedUser?: User;
    @Input() post!: Post;
    @Input() comments: PostComment[] = [];
    @Input() loadIfNotFromPost: boolean = false;
    @Input() canWriteComments: boolean = true;
    @Output() commentsChange = new EventEmitter<PostComment[]>();

    commentsSubscription?: Subscription;

    form = new FormGroup({
        comment: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(500),
        ]),
    });

    constructor(private commentService: CommentService) {}

    ngOnInit(): void {
        if (this.loadIfNotFromPost) {
            this.commentsSubscription = this.commentService
                .getCommentsOnPost(this.post.id)
                .subscribe((comments) => (this.comments = comments));
        } else if (this.post.comments) {
            this.comments = this.post.comments;
        }
    }

    ngOnDestroy() {
        this.commentsSubscription?.unsubscribe();
    }

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        let comment = this.form.value as CreatePostCommentRequest;
        this.commentService
            .addComment(comment, this.post.id)
            .subscribe((comment: PostComment | undefined) => {
                if (comment) {
                    this.form.reset();
                    this.comments.unshift(comment);
                    this.commentsChange.next(this.comments);
                }
            });
    }

    onCommentDeleted(comment: PostComment): void {
        const index = this.comments.findIndex((c) => c === comment);
        if (index != -1) {
            this.comments.splice(index, 1);
            this.commentsChange.emit(this.comments);
        }
    }

    get commentField(): AbstractControl {
        return this.form.get('comment')!;
    }
}
