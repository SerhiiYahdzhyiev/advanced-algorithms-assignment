import { Component, Input } from "@angular/core";
import { Lecture } from "@interfaces";

@Component({
  standalone: true,
  selector: "lecture",
  templateUrl: "./lecture.component.html",
})
export class LectureComponent {
  @Input()
  lecture: Lecture | null = null;
}
