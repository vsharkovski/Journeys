import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    debounceTime,
    delay,
    distinctUntilChanged,
    iif,
    merge,
    of,
    Subject,
    Subscription,
    switchMap,
} from 'rxjs';
import { User } from '../../model/user.model';
import { Post } from '../../model/post.model';
import { SearchService } from '../../service/search.service';

@Component({
    selector: 'app-mini-search',
    templateUrl: './mini-search.component.html',
    styleUrls: ['./mini-search.component.css'],
})
export class MiniSearchComponent implements OnInit {
    form = new FormGroup({
        term: new FormControl(''),
        button: new FormControl(''),
    });
    formSubmitted = new Subject<string | null>();
    searchSubscription?: Subscription;
    users: User[] = [];
    posts: Post[] = [];
    resultsVisible = false;
    focusStatus = new Subject<boolean>();

    constructor(private searchService: SearchService) {}

    ngOnInit(): void {
        this.searchSubscription = merge(
            this.form.get('term')!.valueChanges,
            this.formSubmitted
        )
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((term) =>
                    term ? this.searchService.searchUsersAndPosts(term) : of()
                )
            )
            .subscribe((result) => {
                this.users = result.users;
                this.posts = result.posts;
            });
        this.focusStatus
            .pipe(
                switchMap((v) =>
                    iif(() => v, of(v).pipe(delay(100)), of(v).pipe(delay(200)))
                )
            )
            .subscribe((status) => {
                this.resultsVisible = status;
            });
    }

    ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
    }

    onSubmit(): void {
        this.formSubmitted.next(this.form.get('term')!.value);
    }

    onFocusIn(): void {
        this.focusStatus.next(true);
    }

    onFocusOut(): void {
        this.focusStatus.next(false);
    }
}
