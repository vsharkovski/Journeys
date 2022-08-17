import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TagItem } from 'app/model/tag-item.model';

@Component({
    selector: 'app-tag-container',
    templateUrl: './tag-container.component.html',
    styleUrls: ['./tag-container.component.css'],
})
export class TagContainerComponent {
    @Input() allowRemoving = true;
    @Input() allowSelecting = true;
    @Input() items: TagItem[] = [];
    @Output() itemsChange = new EventEmitter<TagItem[]>();

    onTagClicked(item: TagItem): void {
        if (this.allowSelecting) {
            for (let anyItem of this.items) {
                anyItem.selected = false;
            }
            item.selected = true;
            this.itemsChange.emit(this.items);
        }
    }

    onTagRemove(index: number): void {
        if (this.allowRemoving) {
            this.items.splice(index, 1);
            this.itemsChange.emit(this.items);
        }
    }
}
