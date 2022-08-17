import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.css'],
})
export class TagComponent {
    @Input() text!: string;
    @Input() removable = false;
    @Input() selected = false;
    @Output() clicked = new EventEmitter<any>();
    @Output() removed = new EventEmitter<any>();

    onClicked(): void {
        this.clicked.emit();
    }

    onRemoved(): void {
        this.removed.emit();
    }
}
