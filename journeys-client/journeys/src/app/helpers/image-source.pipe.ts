import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'imageSource',
})
export class ImageSourcePipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}

    transform(value: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(
            `data:image/png;base64,${value}`
        );
    }
}
