import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

import { Component, inject } from "@angular/core";

import { AsyncPipe, CommonModule } from "@angular/common";

import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { ScheduleService } from "./services/schedule.service";
import { CRUDService } from "./services/crud.service";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [
    CRUDService,
    ScheduleService,
  ],
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);

  schedule: any = null;
  isShowing = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(
    Breakpoints.Handset,
  )
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  setShowing(value:boolean) {
    this.isShowing = value;
  }

  constructor(
    private scheduler: ScheduleService,
  ) {}


  generateSchedule() {
    this.scheduler.generateSchedule().then(
      (s) =>{
        this.schedule = JSON.stringify(s,undefined,4);
        this.isShowing = true;
      }
    );
  }
}
