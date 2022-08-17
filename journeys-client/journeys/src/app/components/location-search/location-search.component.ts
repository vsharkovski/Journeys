import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from 'app/model/location.model';
import { LocationService } from 'app/service/location.service';
import {
    debounceTime,
    delay,
    distinctUntilChanged,
    iif,
    of,
    Subject,
    switchMap,
} from 'rxjs';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.css'],
})
export class LocationSearchComponent implements OnInit {
    @Output() searchResultSelected = new EventEmitter<Location>();

    searchTerm = new FormControl('');
    results: Location[] = [];
    resultsVisible = false;

    focusStatus = new Subject<boolean>();

    constructor(private locationService: LocationService) {}

    ngOnInit(): void {
        this.searchTerm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term) =>
                    term && term.length > 0
                        ? this.locationService.searchLocations(term)
                        : of([])
                )
            )
            .subscribe((results) => (this.results = results));
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

    onFocusIn(): void {
        this.focusStatus.next(true);
    }

    onFocusOut(): void {
        this.focusStatus.next(false);
    }

    onResultClick(location: Location): void {
        this.searchResultSelected.emit(location);
        this.searchTerm.reset();
        this.resultsVisible = false;
        this.results = [];
    }
}
