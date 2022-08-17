import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    merge,
    of,
    startWith,
    Subject,
    Subscription,
    switchMap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../model/post.model';
import { SearchService } from 'app/service/search.service';
import { Location } from 'app/model/location.model';
import { TagItem } from 'app/model/tag-item.model';
import { LocationService } from 'app/service/location.service';

@Component({
    selector: 'app-big-search',
    templateUrl: './big-search.component.html',
    styleUrls: ['./big-search.component.css'],
})
export class BigSearchComponent implements OnInit, OnDestroy {
    form = this.formBuilder.group({
        term: [''],
        minCost: 0,
        maxCost: 10000,
    });
    formSubmitted = new Subject<void>();
    posts: Post[] = [];

    locations: Location[] = [];
    locationsChanged = new BehaviorSubject<Location[]>([]);
    locationTags: TagItem[] = [];

    postsSubscription?: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private searchService: SearchService,
        private locationService: LocationService
    ) {}

    ngOnInit(): void {
        combineLatest([
            this.form.valueChanges.pipe(startWith(this.form.value)),
            this.locationsChanged.pipe(startWith([])),
        ]).subscribe((data) => {
            const formValues = data[0];
            const locations = data[1];
            this.router.navigate(['/search'], {
                queryParams: {
                    term: formValues.term,
                    minc: formValues.minCost,
                    maxc: formValues.maxCost,
                    locs: locations.map((it) => it.id).join(','),
                },
            });
        });
        this.locationsChanged.subscribe(
            (locations) =>
                (this.locationTags = locations.map((location) => ({
                    id: location.id,
                    label: location.name,
                    selected: false,
                })))
        );
        this.postsSubscription = merge(
            this.formSubmitted.pipe(
                switchMap(() => of(this.route.snapshot.queryParams))
            ),
            this.route.queryParams
        )
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((params) =>
                    Object.keys(params).length == 0
                        ? of([])
                        : this.searchService.searchPostsComplex(
                              params['term'] ? params['term'] : '',
                              params['minc'] ? Math.ceil(params['minc']) : 0,
                              params['maxc']
                                  ? Math.ceil(params['maxc'])
                                  : 10000,
                              params['locs'] ? params['locs'] : [],
                              true,
                              true,
                              true
                          )
                )
            )
            .subscribe((posts) => (this.posts = posts));
        const queryParamToDataSetters: {
            [index: string]: (value: any) => void;
        } = {
            terms: (value: string) => {
                this.termField.setValue(value);
            },
            minc: (value: number) => {
                this.minCostField.setValue(value);
            },
            maxc: (value: number) => {
                this.maxCostField.setValue(value);
            },
            locs: (value: string) => {
                const locationIds = value
                    .split(',')
                    .map((idString: string) => parseInt(idString))
                    .filter((id) => !isNaN(id));
                this.locationService
                    .searchLocationsByIds(locationIds)
                    .subscribe((locations) => {
                        this.locations = locations;
                        this.locationsChanged.next(locations);
                    });
            },
        };
        for (const paramName in queryParamToDataSetters) {
            const setter = queryParamToDataSetters[paramName];
            const paramVal = this.route.snapshot.queryParams[paramName];
            if (paramVal) {
                setter.call(this, paramVal);
            }
        }
    }

    ngOnDestroy(): void {
        this.postsSubscription?.unsubscribe();
    }

    onSubmit(): void {
        this.formSubmitted.next();
    }

    addLocationFromSearch(location: Location): void {
        this.locations.push(location);
        this.locationsChanged.next(this.locations);
    }

    onTagItemsChange(items: TagItem[]): void {
        let newLocations = [];
        for (let item of items) {
            let result = this.locations.find(
                (value: Location) => value.name == item.label
            );
            if (result) {
                newLocations.push(result);
            }
        }
        this.locations = newLocations;
        this.locationsChanged.next(this.locations);
    }

    get termField(): AbstractControl {
        return this.form.get('term')!;
    }

    get minCostField(): AbstractControl {
        return this.form.get('minCost')!;
    }

    get maxCostField(): AbstractControl {
        return this.form.get('maxCost')!;
    }
}
