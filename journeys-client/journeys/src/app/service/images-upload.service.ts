import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const imageUrl = 'api/images';

@Injectable({
    providedIn: 'root',
})
export class ImagesUploadService {
    constructor(private http: HttpClient) {}

    upload(image: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('image', image);
        const req = new HttpRequest('POST', `${imageUrl}/upload`, formData, {
            reportProgress: true,
            responseType: 'json',
        });
        return this.http.request(req);
    }

    getImagesFromPost(postId: number): Observable<any> {
        return this.http.get(`${imageUrl}/images/${postId}`);
    }
}
