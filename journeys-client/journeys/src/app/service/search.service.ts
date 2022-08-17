import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    SearchPostsResponse,
    SearchPostsUsersResponse,
} from '../model/response/search-response.model';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Post } from 'app/model/post.model';

const searchUrl = 'api/search';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    constructor(private http: HttpClient, private common: CommonService) {}

    searchUsersAndPosts(term: string): Observable<SearchPostsUsersResponse> {
        return this.http
            .get<SearchPostsUsersResponse>(`${searchUrl}/multi?term=${term}`)
            .pipe(
                catchError(
                    this.common.handleError<SearchPostsUsersResponse>(
                        'searchUsersAndPosts',
                        {
                            success: false,
                            posts: [],
                            users: [],
                        }
                    )
                )
            );
    }

    searchPostsComplex(
        term: string,
        minCost: number,
        maxCost: number,
        locationsIds: number[],
        authData: boolean = false,
        countLikes: boolean = false,
        countComments: boolean = false,
        fetchComments?: number,
        fetchLocations?: number
    ): Observable<Post[]> {
        return this.http
            .get<SearchPostsResponse>(`${searchUrl}/complex`, {
                params: this.common.createHttpParams({
                    term: term,
                    minCost: Math.ceil(minCost),
                    maxCost: Math.ceil(maxCost),
                    locationsIds: locationsIds,
                    authData,
                    countLikes,
                    countComments,
                    fetchComments,
                    fetchLocations,
                }),
            })
            .pipe(
                catchError(
                    this.common.handleError<SearchPostsResponse>(
                        'searchPostsComplex',
                        {
                            success: false,
                            posts: [],
                        }
                    )
                ),
                map((response) => response.posts)
            );
    }
}
