import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

type DirtyHttpParamsOptionsObject = {
    [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>
        | undefined;
};

type HttpParamsOptionsObject = {
    [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
};

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);
            const castAttempt = error.error as T;
            if (castAttempt) {
                return of(castAttempt);
            }
            return of(result as T);
        };
    }

    createHttpParams(options: DirtyHttpParamsOptionsObject): HttpParams {
        const cleanOptions = this.cleanHttpParamOptions(options);
        return new HttpParams({ fromObject: cleanOptions });
    }

    private cleanHttpParamOptions(
        options: DirtyHttpParamsOptionsObject
    ): HttpParamsOptionsObject {
        const result = { ...options };
        for (const paramName in result) {
            if (result[paramName] === undefined) {
                delete result[paramName];
            }
        }
        return result as HttpParamsOptionsObject;
    }
}
