import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Location } from 'app/model/location.model';
import {
    Icon,
    icon,
    IconOptions,
    LatLng,
    latLng,
    Layer,
    LeafletMouseEvent,
    Map,
    MapOptions,
    marker,
    tileLayer,
} from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements OnChanges {
    strMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '...',
    });

    wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '...',
    });

    layersControl = {
        baseLayers: {
            'Street Maps': this.strMaps,
            'Wikimedia Maps': this.wMaps,
        },
        overlays: {},
    };

    options: MapOptions = {
        layers: [this.strMaps],
        zoom: 7,
        center: latLng([46.879966, -121.726909]),
    };

    @Input() markedLocations: Location[] = [];
    @Input() specialMarkedLocations: Location[] = [];
    markerLayers: Layer[] = [];
    specialMarkerLayers: Layer[] = [];

    map?: Map;
    @Output() map$ = new EventEmitter<Map>();
    @Output() clicked = new EventEmitter<LatLng>();

    ngOnChanges(changes: SimpleChanges): void {
        const markedLocations = changes['markedLocations'];
        if (markedLocations) {
            this.markerLayers = this.createLayersFromLocations(
                markedLocations.currentValue,
                icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/leaflet/marker-icon.png',
                    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
                    shadowUrl: 'assets/leaflet/marker-shadow.png',
                })
            );
        }
        const specialMarkedLocations = changes['specialMarkedLocations'];
        if (specialMarkedLocations) {
            this.specialMarkerLayers = this.createLayersFromLocations(
                specialMarkedLocations.currentValue,
                icon({
                    iconSize: [32, 46],
                    iconAnchor: [16, 46],
                    iconUrl: 'assets/leaflet/marker-icon.png',
                    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
                    shadowUrl: 'assets/leaflet/marker-shadow.png',
                })
            );
            if (this.map && specialMarkedLocations.currentValue.length > 0) {
                this.map.panTo(
                    new LatLng(
                        specialMarkedLocations.currentValue[0].latitude,
                        specialMarkedLocations.currentValue[0].longitude
                    )
                );
            }
        }
    }

    createLayersFromLocations(
        locations: Location[],
        icon: Icon<IconOptions>
    ): Layer[] {
        return locations.map((location) =>
            marker([location.latitude, location.longitude], {
                icon: icon,
            })
        );
    }

    onMapReady(map: Map) {
        this.map = map;
        this.map$.emit(map);
    }

    onClick(event: LeafletMouseEvent): void {
        this.clicked.emit(event.latlng);
    }
}
