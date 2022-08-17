import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../model/user.model';
import { FollowService } from '../../service/follow.service';
import { UserFollowStatus } from '../../model/user-follow-status.model';

@Component({
    selector: 'app-follow-unfollow-button',
    templateUrl: './follow-unfollow-button.component.html',
    styleUrls: ['./follow-unfollow-button.component.css'],
})
export class FollowUnfollowButtonComponent {
    @Input() loggedUser?: User;
    @Input() targetUser?: User;
    @Input() smallButton: boolean = false;

    @Output() changedAuthorFollowStatus = new EventEmitter<UserFollowStatus>();

    constructor(private followService: FollowService) {}

    onFollow() {
        if (this.loggedUser && this.targetUser) {
            this.followService.followUser(this.targetUser.id).subscribe();
            this.changedAuthorFollowStatus.emit({
                id: this.targetUser.id,
                status: true,
            });
        }
    }

    onUnfollow() {
        if (this.loggedUser && this.targetUser) {
            this.followService.unfollowUser(this.targetUser.id).subscribe();
            this.changedAuthorFollowStatus.emit({
                id: this.targetUser.id,
                status: false,
            });
        }
    }
}
