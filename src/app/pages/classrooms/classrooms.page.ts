import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { Classroom } from "@interfaces";
import { CRUDService } from "@services";
import { ClassroomComponent } from "@components";

@Component({
  standalone: true,
  selector: "classrooms-page",
  templateUrl: "./classrooms.page.html",
  imports: [
    CommonModule,
    ClassroomComponent,
    MatButtonModule,
    MatProgressSpinner,
  ],
  providers: [CRUDService],
})
export class ClassroomsPage implements OnInit {
  classrooms: Classroom[] = [];
  isFetching: boolean = false;

  constructor(private crudService: CRUDService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getClassrooms();
  }

  getClassrooms() {
    this.crudService.getAll<Classroom>("classrooms").subscribe((classrooms) => {
      this.classrooms = classrooms;
      this.isFetching = false;
    }, (error: HttpErrorResponse) => {
      console.error(error);
      this.isFetching = false;
    });
  }
}
