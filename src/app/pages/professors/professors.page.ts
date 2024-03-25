import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { Professor } from "@interfaces";
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
  isFetching: boolean = false;

  constructor(private crudService: CRUDService) { }

  ngOnInit(): void {
    this.isFetching = true;
    this.getProfessors();
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
}