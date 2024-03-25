import { CommonModule } from "@angular/common";

import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";

import { Lecture, Professor, TimeSlot } from "@interfaces";

import { CRUDService } from "@services";
import { TimeSlotComponent } from "../time-slot/time-slot.component";

@Component({
  standalone: true,
  selector: "professor",
  templateUrl: "./professor.component.html",
  styleUrl: "./professor.component.css",
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    TimeSlotComponent,
  ],
  providers: [CRUDService],
})
export class ProfessorComponent implements OnInit {
  @Input()
  professor: Professor = {} as Professor;

  @Input()
  lectures: Lecture[] = [];

  initialName: string = "";
  initialCanTeach: Lecture[] = [];
  canTeach: Lecture[] = [];
  isEditing: boolean = false;

  ngOnInit() {
    this.initialName = this.professor!.fullName;
    this.canTeach = this.lectures.filter((lecture) =>
      this.professor!.canTeach.includes(+lecture.id)
    );
    this.initialCanTeach = [...this.canTeach];
  }

  constructor(private crudService: CRUDService) { }

  handleSaveClick() {
    this.save();
    this.endEditing();
  }

  handleCancel() {
    this.professor!.fullName = this.initialName;
    this.professor!.canTeach = [...this.initialCanTeach.map((l) => +l.id)];
    this.canTeach = [...this.initialCanTeach];
    this.endEditing();
  }

  startEditing() {
    this.isEditing = true;
  }

  endEditing() {
    this.isEditing = false;
  }

  save() {
    this.crudService.update<Professor>("professors", this.professor!.id, {
      ...this.professor!,
      id: undefined,
    }).subscribe();
  }

  addLecture(lecture: Lecture) {
    if (!this.professor!.canTeach.includes(+lecture.id)) {
      this.professor!.canTeach.push(+lecture.id);
      this.canTeach.push({ ...lecture });
    }
  }

  removeLecture(lecture: Lecture) {
    if (this.professor!.canTeach.includes(+lecture.id)) {
      this.professor!.canTeach = this.professor!.canTeach.filter((lectureId) =>
        +lecture.id !== lectureId
      );
      this.canTeach = this.canTeach.filter((l) => l.id !== lecture.id);
    }
  }

  updateSlot() {
    this.save();
  }

  removeSlot(slotId: number) {
    this.professor.availableAt = this.professor.availableAt.filter((slot) =>
      slot.id !== slotId
    );
    this.save();
  }

  remove() {
    console.log("Removing");
    this.crudService.delete("professors", this.professor!.id).subscribe(
      () => window.location.reload(),
    );
  }
}
