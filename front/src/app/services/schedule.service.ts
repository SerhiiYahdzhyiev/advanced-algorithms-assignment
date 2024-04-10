import { Injectable } from "@angular/core";
import {
  Classroom,
  Lecture,
  Professor,
  ScheduleEntry,
  TimeSlot,
  Weekday,
} from "@interfaces";
import { CRUDService } from "./crud.service";

type ClassroomId = string;
type ProfessorId = string;

@Injectable()
export class ScheduleService {
  professors: Professor[] = [];
  lectures: Lecture[] = [];
  classrooms: Classroom[] = [];

  private assignedLecturesCount: number = 0;

  private lecturesIds: Set<string> = new Set();
  private canBeTeached: Set<string> = new Set();

  private classrooomsCapacities: number[] = [];
  private lecturesParticipantsCounts: number[] = [];

  private lectureToProfessors: Map<string, Professor[]> = new Map();
  private professorToSlots: Map<ProfessorId, TimeSlot[]> = new Map();
  private occupiedSlots: Map<ClassroomId, TimeSlot[]> = new Map();
  private schedule: Map<Weekday, ScheduleEntry[]> = new Map();

  constructor(private crudService: CRUDService) {
    for (const weekday of Object.values(Weekday)) {
      this.schedule.set(weekday, []);
    }
  }

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
    // Reset
    for (const weekday of Object.values(Weekday)) {
      this.schedule.set(weekday, []);
    }
    this.assignedLecturesCount = 0;

    // Populate sets
    this.lecturesIds = new Set([...this.lectures.map((l) => l.id)]);
    this.canBeTeached = new Set([...[
      ...this.professors.map((p) => p.canTeach),
    ].flat()]);

    const timeSlots: TimeSlot[] = [
      ...[...this.professors.map((p) => p.availableAt)].flat(),
    ];

    // Add duration to timeSlots
    for (const slot of timeSlots) {
      (slot as any).duration = getLengthFrom(slot);
    }

    // Populate arrays
    this.classrooomsCapacities = this.classrooms.map((c) => c.capacity);
    this.lecturesParticipantsCounts = this.lectures.map((l) =>
      l.participantsCount
    );

    // Populate lecture to professors map
    for (const lecture of this.lectures) {
      const professors = this.professors.filter((p) =>
        p.canTeach.includes(lecture.id)
      );
      this.lectureToProfessors.set(lecture.id, professors);
    }

    //Initialize occupied slots map
    for (const classroom of this.classrooms) {
      this.occupiedSlots.set(classroom.id, []);
    }

    // Initialize professor to slots map
    for (const professor of this.professors) {
      this.professorToSlots.set(professor.id, professor.availableAt);
    }
  }

  checkCanGenerate() {
    let message = "";

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

    const maxCapacity = Math.max(...this.classrooomsCapacities);
    const maxParticipants = Math.max(...this.lecturesParticipantsCounts);

    if (maxParticipants > maxCapacity) {
      message = "Unable to generate Schedule: Maximum classrom capacity is " +
        maxCapacity + " and there is a lecture with " + maxParticipants +
        " participants!";
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

  assign(
    lecture: Lecture,
    professor: Professor,
    classroom: Classroom,
    weekday: Weekday,
  ) {
    this.schedule.get(weekday)!.push({
      lecture,
      professor,
      classroom,
    });

    this.assignedLecturesCount++;
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

    // The algorithm
    for (let lecture of this.lectures) {
      let assigned = false;
      const professors = this.lectureToProfessors.get(lecture.id)!;

      for (const professor of professors) {
        if (assigned) break;
        for (const timeSlot of professor.availableAt) {
          if (assigned) break;
          if (timeSlot.duration! < lecture.duration) {
            continue;
          }

          const lectureSlot = getLectureTimeSlot(timeSlot, lecture.duration);

          const classroom = this.findAvailableClassroom(lectureSlot, lecture.participantsCount);
          if (!classroom) {
            console.log(
              `No available classrooms for lecture: ${lecture.title} and timeSlot: ${JSON.stringify(timeSlot)}`
            );
            continue;
          }

          lecture = {
            ...lecture,
            start: lectureSlot.from,
            end: lectureSlot.to
          };

          // Update professors availability
          if (getTotalMinutesFrom(timeSlot.from) + lecture.duration === getTotalMinutesFrom(timeSlot.to)) {
            professor.availableAt = professor.availableAt.filter(slot => slot.id !== timeSlot.id);
          } else {
            timeSlot.from = getTimeFrom(
              getTotalMinutesFrom(timeSlot.from) + lecture.duration
            );
            timeSlot.duration = getLengthFrom(timeSlot);
          }

          this.assign(lecture, professor, classroom, timeSlot.weekday);

          // If the lecture is assigned, break the loop
          assigned = true;
          break;
        }
      }
    }
    if (this.assignedLecturesCount !== this.lectures.length)
      alert("Failed to compose weekly schedule for this input data!");

    return [...this.schedule.entries()];
  }

  findAvailableClassroom(
    timeSlot: TimeSlot,
    capacity: number,
  ): Classroom | null {
    // Find a classroom that is available during the given time slot and has enough capacity
    return this.classrooms.find((classroom) =>
      classroom.capacity >= capacity &&
      !this.isClassroomOccupied(classroom, timeSlot)
    ) || null;
  }

  isClassroomOccupied(
    classroom: Classroom,
    timeSlot: TimeSlot,
  ): boolean {
    // Check if the classroom is occupied during the given time slot
    const occupiedSlots = this.occupiedSlots.get(classroom.id)!;
    if (!occupiedSlots.length) return false;

    return occupiedSlots.every(slot => !slotsOverlap(slot, timeSlot));
  }
}

function getTimeFrom(totalMinutes: number) {
  const hours = Math.trunc(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours * 100 + minutes;
}

function getLengthFrom(timeSlot: TimeSlot): number {
  return getTotalMinutesFrom(timeSlot.to) - getTotalMinutesFrom(timeSlot.from);
}

function getTotalMinutesFrom(time: number) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;

  return hours * 60 + minutes;
}

function slotsOverlap(a: TimeSlot, b: TimeSlot) {
  const startA = getTotalMinutesFrom(a.from);
  const startB = getTotalMinutesFrom(b.from);
  const endA = getTotalMinutesFrom(a.to);
  const endB = getTotalMinutesFrom(b.to);

  return !(startA >= endB || endA <= startB)
}

function getLectureTimeSlot(slot: TimeSlot, duration: number): TimeSlot {
  const start = getTotalMinutesFrom(slot.from);

  return {
      id: Math.random() * 100,
      weekday: slot.weekday,
      from: getTimeFrom(start),
      to: getTimeFrom(start + duration),
      duration,
  };
}
