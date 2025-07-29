import { Component } from "@angular/core";

import { IconxModule, MaterialUIModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { ICanComponentDeactivate } from "../../types";

@Component({
  selector: "page-app",
  imports: [LayoutDefault, MaterialUIModule, IconxModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  canDeactivate() {
    return true;
  }
}
