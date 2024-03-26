import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { Lecture } from "@interfaces";
import { CRUDService } from "@services";
import { LectureComponent } from "@components";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  standalone: true,
  selector: "lectures-page",
  templateUrl: "./lectures.page.html",
  imports: [
    CommonModule,
    LectureComponent,
    MatButtonModule,
    MatProgressSpinner,
  ],
  providers: [CRUDService],
})
export class LecturesPage implements OnInit {
  lectures: Lecture[] = [];
  isFetching: boolean = false;

  constructor(private crudService: CRUDService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getLectures();
  }

  getLectures() {
    this.crudService.getAll<Lecture>("lectures").subscribe((lectures) => {
      this.lectures = lectures;
      this.isFetching = false;
    }, (error: HttpErrorResponse) => {
      console.error(error);
      this.isFetching = false;
    });
  }

  addLecture() {
    const newLecture = {
      title: "New Lecture Title",
      participantsCount: 42,
      duration: 69,
    };

    this.crudService.create<Lecture>("lectures", newLecture).subscribe(
      (lecture) => this.lectures.push(lecture)
    );
  }
}
