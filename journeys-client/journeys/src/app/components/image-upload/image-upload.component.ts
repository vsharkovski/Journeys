import { Component } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagesUploadService } from '../../service/images-upload.service';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent {
    selectedFiles?: FileList;
    progressInfos: any[] = [];
    message: string[] = [];
    fileInfos?: Observable<any>;

    constructor(private uploadService: ImagesUploadService) {}

    selectFiles({ event }: { event: any }): void {
        this.message = [];
        this.progressInfos = [];
        this.selectedFiles = event.target.files;
    }

    upload(idx: number, file: File): void {
        this.progressInfos[idx] = { value: 0, fileName: file.name };
        if (file) {
            this.uploadService.upload(file).subscribe({
                next: (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progressInfos[idx].value = Math.round(
                            (100 * event.loaded) / event.total
                        );
                    } else if (event instanceof HttpResponse) {
                        const msg =
                            'Uploaded the file successfully: ' + file.name;
                        this.message.push(msg);
                    }
                },
                error: (err: any) => {
                    this.progressInfos[idx].value = 0;
                    const msg = 'Could not upload the file: ' + file.name;
                    this.message.push(msg);
                },
            });
        }
    }

    uploadFiles(): void {
        this.message = [];
        if (this.selectedFiles) {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.upload(i, this.selectedFiles[i]);
            }
        }
    }
}
