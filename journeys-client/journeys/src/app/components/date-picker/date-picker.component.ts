import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate;
    toDate: NgbDate | null = null;

    @Output() datesChanged = new EventEmitter<{
        fromDate: number;
        toDate: number;
    }>();

    constructor(calendar: NgbCalendar) {
        this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 10);
        this.toDate = calendar.getToday();
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
        this.datesChanged.emit({
            fromDate: new Date(
                this.fromDate.year,
                this.fromDate.month - 1,
                this.fromDate.day
            ).getTime(),
            toDate: new Date(
                <number>this.toDate?.year,
                <number>this.toDate?.month - 1,
                <number>this.toDate?.day
            ).getTime(),
        });
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate &&
            !this.toDate &&
            this.hoveredDate &&
            date.after(this.fromDate) &&
            date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return (
            this.toDate && date.after(this.fromDate) && date.before(this.toDate)
        );
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }
}
