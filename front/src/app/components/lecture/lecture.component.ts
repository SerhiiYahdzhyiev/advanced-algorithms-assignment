import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";

import { Lecture } from "@interfaces";

import { CRUDService } from "@services";

@Component({
  standalone: true,
  selector: "lecture",
  templateUrl: "./lecture.component.html",
  styleUrl: "./lecture.component.css",
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    CRUDService,
  ],
})
export class LectureComponent implements OnInit {
  @Input()
  lecture: Lecture = {} as Lecture;

  isEditing: boolean = false;

  initialTitle: string = "";
  initialParticipants: number = 0;
  initialDuration: number = 0;

  ngOnInit() {
    this.initialTitle = this.lecture.title;
    this.initialParticipants = this.lecture.participantsCount;
    this.initialDuration = this.lecture.duration;
  }

  constructor(private crudService: CRUDService) { }

  startEditing() {
    this.isEditing = true;
  }

  endEditing() {
    this.isEditing = false;
  }

  save() {
    this.crudService.update<Lecture>(
      "lectures",
      this.lecture.id,
      this.lecture,
    ).subscribe();

    this.initialDuration = this.lecture.duration;
    this.initialParticipants = this.lecture.participantsCount;
    this.initialTitle = this.lecture.title;

    this.endEditing();
  }

  handleCancel() {
    this.lecture.title = this.initialTitle;
    this.lecture.duration = this.initialDuration;
    this.lecture.participantsCount = this.initialParticipants;
    this.endEditing();
  }

  remove() {
    this.crudService.delete<Lecture>("lectures", this.lecture.id)
      .subscribe(() => window.location.reload());
  }
}
