import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Professor } from "@interfaces";
import { CRUDService } from "@services";

@Component({
  standalone: true,
  selector: "professor",
  templateUrl: "./professor.component.html",
  styleUrl: "./professor.component.css",
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [CRUDService],
})
export class ProfessorComponent {
  @Input()
  professor: Professor | null = null;

  isEditing: boolean = false;

  constructor(private crudService: CRUDService) { }

  startEditing() {
    this.isEditing = true;
  }

  save() {
    //TODO: Realize
    this.isEditing = false;
  }

  remove() {
    this.crudService.delete("professors", this.professor!.id);
  }
}
