export enum Weekday {
  MONDAY = "Mo",
  TUESDAY = "Tu",
  WEDNESDAY = "We",
  THURSDAY = "Th",
  FRIDAY = "Fr",
  SATURDAY = "Sa",
  SUNDAT = "Su",
}
export interface Professor {
  id: string;
  fullName: string;
  availableAt: TimeSlot[];
  canTeach: string[]; // Lecture.id[]
}
export interface Lecture {
  id: string;
  title: string;
  participantsCount: number;
  duration: number;
  start?: number;
  end?: number;
}

export interface Classroom {
  id: string;
  title: string;
  capacity: number;
}

export interface TimeSlot {
  id: number;
  weekday: Weekday;
  from: number;
  to: number;
  duration?: number; // In minutes
}

export interface ScheduleEntry {
  lecture: Lecture;
  professor: Professor;
  classroom: Classroom;
}
