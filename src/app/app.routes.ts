import { Routes } from "@angular/router";

import { ProfessorsPage } from "./pages/professors/professors.page";
import { PageNotFound } from "./pages/not-found/not-found.page";
import { ClassroomsPage } from "./pages/classrooms/classrooms.page";
import { LecturesPage } from "./pages/lectures/lectures.page";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "professors" },
  { path: "professors", component: ProfessorsPage },
  { path: "classrooms", component: ClassroomsPage },
  { path: "lectures", component: LecturesPage },
  { path: "**", component: PageNotFound },
];
