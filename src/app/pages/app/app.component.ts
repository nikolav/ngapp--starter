import { Component } from "@angular/core";

import { IconxModule, CommonMaterialModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { ICanComponentDeactivate } from "../../types";

@Component({
  selector: "page-app",
  imports: [LayoutDefault, CommonMaterialModule, IconxModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  canDeactivate() {
    return true;
  }
}
