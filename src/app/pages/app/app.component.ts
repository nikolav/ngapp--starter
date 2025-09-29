import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MaterialUIModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { ICanComponentDeactivate } from "../../types";

@Component({
  selector: "page-app",
  imports: [LayoutDefault, MaterialUIModule, RouterModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  canDeactivate() {
    return true;
  }
}
