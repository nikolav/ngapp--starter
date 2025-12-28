import { Component } from "@angular/core";

@Component({
  selector: "app-layout-default",
  imports: [],
  templateUrl: "./default.component.html",
  styleUrl: "./default.component.scss",
  host: {
    class: "layout--default",
  },
})
export class DefaultComponent {}
