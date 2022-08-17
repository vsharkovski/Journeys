import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from 'app/model/location.model';
import { TagItem } from 'app/model/tag-item.model';
import { LatLng, Map } from 'leaflet';
import { merge, of } from 'rxjs';

@Component({
    selector: 'app-location-picker',
    templateUrl: './location-picker.component.html',
    styleUrls: ['./location-picker.component.css'],
})
export class LocationPickerComponent implements OnInit {
    @Input() allowAdding = true;
    @Input() allowRemoving = true;
    @Input() locations: Location[] = [];
    @Output() locationsChange = new EventEmitter<Location[]>();
    @Output() map$ = new EventEmitter<Map>();

    unselectedLocations: Location[] = [];
    selectedLocations: Location[] = [];

    tagItems: TagItem[] = [];

    newLocationName = new FormControl('');
    waitingToPickPositionOnMap = false;

    ngOnInit(): void {
        if (this.allowAdding) {
            this.newLocationName.valueChanges.subscribe((name) => {
                if (name && name.length > 0) {
                    this.waitingToPickPositionOnMap = true;
                } else {
                    this.waitingToPickPositionOnMap = false;
                }
            });
        }
        this.locationsChange.subscribe(
            (locations) =>
                (this.tagItems = locations.map((location) => ({
                    id: location.id,
                    label: location.name,
                    selected: this.selectedLocations.includes(location),
                })))
        );
        merge(of(), this.map$).subscribe(() => {
            if (this.locations.length > 0) {
                this.updateLocations(
                    [...this.locations],
                    this.locations.slice(1),
                    [this.locations[0]]
                );
            }
        });
    }

    receiveMap(map: Map): void {
        this.map$.emit(map);
    }

    onMapClick(latlng: LatLng): void {
        if (this.allowAdding && this.waitingToPickPositionOnMap) {
            const location = {
                id: 0,
                name: this.newLocationName.value!,
                latitude: latlng.lat,
                longitude: latlng.lng,
            };
            this.updateLocations(
                this.locations.concat([location]),
                [...this.locations],
                [location]
            );
            this.newLocationName.reset();
            this.waitingToPickPositionOnMap = false;
        }
    }

    addLocationFromSearch(location: Location): void {
        this.waitingToPickPositionOnMap = false;
        this.newLocationName.reset();
        this.updateLocations(
            this.locations.concat([location]),
            [...this.locations],
            [location]
        );
    }

    onTagItemsChange(items: TagItem[]): void {
        let newLocations = [];
        let newUnselected = [];
        let newSelected = [];
        for (let item of items) {
            let result = this.locations.find(
                (value: Location) => value.name == item.label
            );
            if (result) {
                newLocations.push(result);
                if (item.selected) {
                    newSelected.push(result);
                } else {
                    newUnselected.push(result);
                }
            }
        }
        if (newSelected.length == 0 && newUnselected.length > 0) {
            newSelected.push(newUnselected.pop()!);
        }
        this.updateLocations(newLocations, newUnselected, newSelected);
    }

    updateLocations(
        locations: Location[],
        unselected: Location[],
        selected: Location[]
    ): void {
        this.unselectedLocations = unselected;
        this.selectedLocations = selected;
        this.locations = locations;
        this.locationsChange.emit(locations);
    }
}
