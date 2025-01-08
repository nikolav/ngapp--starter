import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  imports: [RouterModule, MatButtonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
    console.log("@ngOnInit");
  }
}
