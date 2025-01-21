import { Component, OnInit, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CommonMaterialModule } from "./modules";
import {
  EmitterService,
  AppConfigService,
} from "./services";

@Component({
  selector: "app-root",
  imports: [RouterModule, CommonMaterialModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  private $emitter = inject(EmitterService);
  private $config = inject(AppConfigService);

  ngOnInit() {
    console.log("@debug:ngOnInit --app.component");
    // @next:init
    setTimeout(() =>
      this.$emitter.subject.next(this.$config.events.EVENT_APP_INIT)
    );
  }
}
