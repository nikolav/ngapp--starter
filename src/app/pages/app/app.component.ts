import { Component } from "@angular/core";

import { IconxModule, CommonMaterialModule } from "../../modules";
import { LayoutDefault } from "../../layouts";

@Component({
  selector: "page-app",
  imports: [LayoutDefault, CommonMaterialModule, IconxModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {}
