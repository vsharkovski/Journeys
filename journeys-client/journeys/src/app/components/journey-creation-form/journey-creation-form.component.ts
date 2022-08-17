import { Component, ViewChild } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../model/post.model';
import { CreatePostRequest } from '../../model/create-post-request.model';
import { PostService } from '../../service/post.service';
import { Router } from '@angular/router';
import { Map } from 'leaflet';
import { Location } from 'app/model/location.model';
import { Image } from '../../model/image.model';

@Component({
    selector: 'app-journey-creation-form',
    templateUrl: './journey-creation-form.component.html',
    styleUrls: ['./journey-creation-form.component.css'],
})
export class JourneyCreationFormComponent {
    form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.maxLength(10000)]),
        totalCost: new FormControl(0),
        costComment: new FormControl(''),
        image: new FormControl(),
    });

    fromToDates?: { fromDate: number; toDate: number };
    locations: Location[] = [];
    images: Image[] = [];

    map?: Map;

    rating = 0;

    @ViewChild(NgbNav) nav!: NgbNav;
    firstTab = 1;
    finalTab = 5;
    currentTab = this.firstTab;

    constructor(private router: Router, private postService: PostService) {}

    onPreviousPage(): void {
        if (this.currentTab > this.firstTab) {
            this.currentTab -= 1;
        }
    }

    onNextPage(): void {
        if (this.currentTab < this.finalTab) {
            this.currentTab += 1;
        }
    }

    onPageShown(id: number): void {
        if (id == 4) {
            if (this.map) {
                this.map.invalidateSize();
            }
        }
    }

    onSubmit(): void {
        if (!this.form.valid) {
            return;
        }
        let post = this.form.value as CreatePostRequest;
        post.picture = this.form.get('image')?.value;
        post.rating = this.rating;
        post.fromDate = this.fromToDates?.fromDate ?? 0;
        post.toDate = this.fromToDates?.toDate ?? 0;
        post.locations = this.locations;
        this.postService.addPost(post).subscribe((post?: Post) => {
            if (post) {
                this.router.navigate(['/journey', post.id]);
            }
        });
    }

    onDateChange(dates: { fromDate: number; toDate: number }): void {
        this.fromToDates = dates;
    }

    onFileChange(event: Event): void {
        let file = (event.target as HTMLInputElement).files![0];
        this.form.patchValue({
            image: file,
        });
    }

    receiveMap(map: Map): void {
        this.map = map;
    }

    get titleField(): AbstractControl {
        return this.form.get('title')!;
    }

    get descriptionField(): AbstractControl {
        return this.form.get('description')!;
    }

    get costField(): AbstractControl {
        return this.form.get('totalCost')!;
    }
}
