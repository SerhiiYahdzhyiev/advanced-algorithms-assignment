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
  id: number;
  fullName: string;
  availableAt: TimeSlot[];
  canTeach: number[]; // Lecture.id[]
}
export interface Lecture {
  id: number;
  title: string;
}
export interface Classroom {
  id: number;
  title: string;
}

export interface TimeSlot {
  id: number;
  weekday: Weekday;
  from: number;
  to: number;
}
