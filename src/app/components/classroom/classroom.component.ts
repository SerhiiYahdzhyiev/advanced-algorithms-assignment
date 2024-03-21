import { Component, Input } from "@angular/core";
import { Classroom } from "@interfaces";

@Component({
  standalone: true,
  selector: "classroom",
  templateUrl: "./classroom.component.html",
})
export class ClassroomComponent {
  @Input()
  classroom: Classroom | null = null;
}
