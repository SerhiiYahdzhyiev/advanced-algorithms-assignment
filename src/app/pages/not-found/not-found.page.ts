import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "page-not-found",
  templateUrl: "./not-found.page.html",
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class PageNotFound {}
