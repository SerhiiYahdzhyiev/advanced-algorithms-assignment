import { Injectable } from "@angular/core";
import { Classroom, Lecture, Professor, TimeSlot } from "@interfaces";
import { CRUDService } from "./crud.service";

@Injectable()
export class ScheduleService {
  professors: Professor[] = [];
  lectures: Lecture[] = [];
  classrooms: Classroom[] = [];

  private lecturesIds: Set<string> = new Set();
  private canBeTeached: Set<string> = new Set();

  constructor(private crudService: CRUDService) {}

  async loadInputs() {
    return Promise.all([
      new Promise<void>((resolve) => {
        this.crudService.getAll<Professor>("professors").subscribe((data) => {
          {
            this.professors = data;
            resolve();
          }
        });
      }),
      new Promise<void>((resolve) => {
        this.crudService.getAll<Lecture>("lectures").subscribe((data) => {
          {
            this.lectures = data;
            resolve();
          }
        });
      }),
      new Promise<void>((resolve) => {
        this.crudService.getAll<Classroom>("classrooms").subscribe((data) => {
          {
            this.classrooms = data;
            resolve();
          }
        });
      }),
    ]);
  }

  prepareData() {
    this.lecturesIds = new Set([...this.lectures.map((l) => l.id)]);
    this.canBeTeached = new Set([...[
      ...this.professors.map((p) => p.canTeach),
    ].flat()]);

    const timeSlots: TimeSlot[] = [
      ...[...this.professors.map((p) => p.availableAt)].flat(),
    ];

    for (const slot of timeSlots) {
      (slot as any).duration = getLengthFrom(slot);
    }

    console.log(this.professors);
  }

  checkCanGenerate() {
    let message = "";

    console.log(this.canBeTeached);
    console.log(this.lecturesIds);

    //@ts-ignore
    const diff = this.lecturesIds.difference(this.canBeTeached);

    if (diff.size) {
      let lecturesMissingTeacher = [];
      for (const id of diff.values()) {
        const lecture = this.lectures.find((l) => l.id === id);
        lecturesMissingTeacher.push(lecture?.title);
      }
      message = "Unable to generate Schedule: no teacher for lectures: " +
        lecturesMissingTeacher.join(", ");
    }

    return message;
  }

  validateInitalData(): string {
    let message = "";
    if (!this.lectures.length) {
      message = "Unable to generate Schedule: no lectures to schedule!";
    }
    if (!this.professors.length) {
      message = "Unable to generate Schedule: no professors to teach!";
    }
    if (!this.classrooms.length) {
      message = "Unable to generate Schedule: no classrooms to assign!";
    }
    return message;
  }

  async generateSchedule() {
    await this.loadInputs();

    let error = this.validateInitalData();

    if (error) {
      alert(error);
      return;
    }

    this.prepareData();
    error = this.checkCanGenerate();

    if (error) {
      alert(error);
      return;
    }
  }
}

function getLengthFrom(timeSlot: TimeSlot): number {
  return getTotalMinutesFrom(timeSlot.to) - getTotalMinutesFrom(timeSlot.from);
}

function getTotalMinutesFrom(time: number) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;

  return hours * 60 + minutes;
}
