import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { TimeSlot, Weekday } from "@interfaces";

@Component({
  standalone: true,
  selector: "time-slot",
  templateUrl: "./time-slot.component.html",
  styleUrl: "./time-slot.compoonent.css",
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
})
export class TimeSlotComponent {
  @Input()
  slot: TimeSlot = {
    weekday: Weekday.MONDAY,
    from: 800,
    to: 1800,
  } as TimeSlot;

  @Output()
  saved = new EventEmitter<TimeSlot>();

  @Output()
  removed = new EventEmitter<number>();

  isEditing: boolean = false;

  startEditing() {
    this.isEditing = true;
  }

  endEditing() {
    this.isEditing = false;
  }

  handleSave() {
    this.saved.emit(this.slot);
    this.endEditing();
  }

  handleRemove() {
    this.removed.emit(this.slot.id);
  }

  formatSlotTime(time: number) {
    let timeString = time.toString();

    if (timeString.length < 4) {
      timeString = "0" + timeString;
    }

    return timeString.substring(0, 2) + ":" +
      timeString.substring(2, 4);
  }

  formatToSlotTime(timeString: string) {
    const parts = timeString.split(":");

    return parseInt(parts.join(""));
  }

  get formattedFrom() {
    return this.formatSlotTime(this.slot.from);
  }
  get formattedTo() {
    return this.formatSlotTime(this.slot.to);
  }

  set formattedFrom(value: string) {
    this.slot.from = this.formatToSlotTime(value);
  }

  set formattedTo(value: string) {
    this.slot.to = this.formatToSlotTime(value);
  }
}
