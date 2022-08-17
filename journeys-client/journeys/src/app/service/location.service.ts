import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'app/model/location.model';
import { LocationInfoListResponse } from 'app/model/response/location-response.model';
import { catchError, map, Observable } from 'rxjs';
import { CommonService } from './common.service';

const locationUrl = 'api/location';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor(private http: HttpClient, private common: CommonService) {}

    searchLocations(term: string): Observable<Location[]> {
        return this.http
            .get<LocationInfoListResponse>(`${locationUrl}/find`, {
                params: new HttpParams({
                    fromObject: {
                        term: term,
                    },
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<LocationInfoListResponse>(
                        'searchLocations',
                        { success: false, locations: [] }
                    )
                ),
                map((response) => response.locations)
            );
    }

    searchLocationsByIds(ids: number[]): Observable<Location[]> {
        return this.http
            .get<LocationInfoListResponse>(`${locationUrl}/find_ids`, {
                params: new HttpParams({
                    fromObject: {
                        ids: ids,
                    },
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<LocationInfoListResponse>(
                        'searchLocationsByIds',
                        { success: false, locations: [] }
                    )
                ),
                map((response) => response.locations)
            );
    }
}
