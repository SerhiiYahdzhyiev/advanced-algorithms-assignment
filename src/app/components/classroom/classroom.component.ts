import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";

import { Classroom } from "@interfaces";

import { CRUDService } from "@services";

@Component({
  standalone: true,
  selector: "classroom",
  templateUrl: "./classroom.component.html",
  styleUrl: "./classroom.component.css",
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
export class ClassroomComponent implements OnInit {
  @Input()
  classroom: Classroom = {} as Classroom;

  isEditing: boolean = false;

  initialTitle: string = "";
  initialCapacity: number = 0;

  ngOnInit() {
    this.initialTitle = this.classroom.title;
    this.initialCapacity = this.classroom.capacity;
  }

  constructor(private crudService: CRUDService) { }

  startEditing() {
    this.isEditing = true;
  }

  endEditing() {
    this.isEditing = false;
  }

  save() {
    this.crudService.update<Classroom>(
      "classrooms",
      this.classroom.id,
      this.classroom,
    ).subscribe();

    this.initialCapacity = this.classroom.capacity;
    this.initialTitle = this.classroom.title;

    this.endEditing();
  }

  handleCancel() {
    this.classroom.title = this.initialTitle;
    this.classroom.capacity = this.initialCapacity;
    this.endEditing();
  }

  remove() {
    this.crudService.delete<Classroom>("classrooms", this.classroom.id)
      .subscribe(() => window.location.reload());
  }
}
