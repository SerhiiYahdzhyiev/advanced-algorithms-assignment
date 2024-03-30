import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { Lecture, Professor } from "@interfaces";
import { CRUDService } from "@services";
import { ProfessorComponent } from "@components";

@Component({
  standalone: true,
  selector: "professors-page",
  templateUrl: "./professors.page.html",
  imports: [
    ProfessorComponent,
    CommonModule,
    MatButtonModule,
    MatProgressSpinner,
  ],
  providers: [CRUDService],
})
export class ProfessorsPage implements OnInit {
  professors: Professor[] = [];
  lectures: Lecture[] = [];
  isFetching: boolean = false;

  constructor(private crudService: CRUDService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getLectures();
    this.getProfessors();
  }

  addProfessor() {
    const newProfessor: Partial<Professor> = {
      fullName: "Professor Name",
      canTeach: [],
      availableAt: [],
    };

    this.crudService.create<Professor>("professors", newProfessor).subscribe(
      (professor) => {
        this.professors.push(professor);
      },
    );
  }

  getProfessors() {
    this.crudService.getAll<Professor>("professors").subscribe((professors) => {
      this.professors = professors;
      this.isFetching = false;
    }, (error: HttpErrorResponse) => {
      console.error(error);
      this.isFetching = false;
    });
  }

  getLectures() {
    this.crudService.getAll<Lecture>("lectures").subscribe((lectures) => {
      this.lectures = lectures;
    }, (error: HttpErrorResponse) => {
      console.error(error);
    });
  }
}
