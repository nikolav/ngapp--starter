import { Component, OnInit, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CommonMaterialModule } from "./modules";
import { EmitterService } from "./services";

@Component({
  selector: "app-root",
  imports: [RouterModule, CommonMaterialModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  private $emitter = inject(EmitterService);
  ngOnInit(): void {
    console.log("@ngOnInit");
    setTimeout(() => this.$emitter.handle((emitter) => emitter.emit("@foo")));
  }
}
