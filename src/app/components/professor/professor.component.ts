import { Component, Input } from "@angular/core";
import { Professor } from "@interfaces";

@Component({
  standalone: true,
  selector: "professor",
  templateUrl: "./professor.component.html",
})
export class ProfessorComponent {
  @Input()
  professor: Professor | null = null;
}
