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

@Injectable()
export class ScheduleService {
  professors: Professor[] = [];
  lectures: Lecture[] = [];
  classrooms: Classroom[] = [];

  private lecturesIds: Set<string> = new Set();
  private canBeTeached: Set<string> = new Set();
  private classrooomsCapacities: number[] = [];
  private lecturesParticipantsCounts: number[] = [];
  private lectureToProfessors: Map<string, Professor[]> = new Map();

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

    this.classrooomsCapacities = this.classrooms.map((c) => c.capacity);
    this.lecturesParticipantsCounts = this.lectures.map((l) =>
      l.participantsCount
    );

    for (const lecture of this.lectures) {
      const professors = this.professors.filter((p) =>
        p.canTeach.includes(lecture.id)
      );
      this.lectureToProfessors.set(lecture.id, professors);
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

    for (const lecture of this.lectures) {
      const professors = this.lectureToProfessors.get(lecture.id);

      if (!professors || professors.length === 0) {
        console.log(`No professors available for lecture: ${lecture.title}`);
        continue;
      }

      for (const professor of professors) {
        for (const timeSlot of professor.availableAt) {
          const classroom = this.findAvailableClassroom(
            timeSlot,
            lecture,
          );
          if (!classroom) {
            console.log(
              `No available classrooms for lecture: ${lecture.title}`,
            );
            continue;
          }

          this.schedule.get(timeSlot.weekday)?.push({
            lecture,
            professor,
            classroom,
            timeSlot,
          });

          // If the lecture is assigned, break the loop
          break;
        }
      }
    }

    console.log(this.schedule);
  }

  findAvailableClassroom(
    timeSlot: TimeSlot,
    lecture: Lecture,
  ): Classroom | undefined {
    // Find a classroom that is available during the given time slot and has enough capacity
    return this.classrooms.find((classroom) =>
      classroom.capacity >= lecture.participantsCount &&
      !this.isClassroomOccupied(classroom, timeSlot, lecture.duration)
    );
  }

  isClassroomOccupied(
    classroom: Classroom,
    timeSlot: TimeSlot,
    duration: number,
  ): boolean {
    // Check if the classroom is occupied during the given time slot
    const occupiedScheduleEntries = this.getOccupiedScheduleEntries(timeSlot);
    const endMinutes = getTotalMinutesFrom(timeSlot.from) + timeSlot.duration!;

    for (const entry of occupiedScheduleEntries) {
      if (entry.classroom.id === classroom.id) {
        const entryEndMinutes = getTotalMinutesFrom(entry.timeSlot.from) +
          entry.timeSlot.duration!;
        if (
          (entryEndMinutes > getTotalMinutesFrom(timeSlot.from) &&
            entryEndMinutes <= endMinutes) ||
          (getTotalMinutesFrom(entry.timeSlot.from) >=
              getTotalMinutesFrom(timeSlot.from) &&
            getTotalMinutesFrom(entry.timeSlot.from) < endMinutes)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getOccupiedScheduleEntries(timeSlot: TimeSlot): ScheduleEntry[] {
    // Get all schedule entries that are occupied during the given time slot
    return this.schedule.get(timeSlot.weekday)?.filter((entry) => {
      const entryEndMinutes = getTotalMinutesFrom(entry.timeSlot.from) +
        entry.timeSlot.duration!;
      const slotEndMinutes = getTotalMinutesFrom(timeSlot.from) +
        timeSlot.duration!;
      return (entryEndMinutes > getTotalMinutesFrom(timeSlot.from) &&
        entryEndMinutes <= slotEndMinutes) ||
        (getTotalMinutesFrom(entry.timeSlot.from) >=
            getTotalMinutesFrom(timeSlot.from) &&
          getTotalMinutesFrom(entry.timeSlot.from) < slotEndMinutes);
    }) || [];
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
