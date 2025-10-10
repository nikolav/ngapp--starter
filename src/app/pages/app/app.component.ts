import { Component, computed, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MaterialUIModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { ICanComponentDeactivate } from "../../types";
import { StoreAuth } from "../../stores";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "page-app",
  imports: [LayoutDefault, MaterialUIModule, RouterModule, AsyncPipe],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  readonly $auth = inject(StoreAuth);

  idToken = computed(() => this.$auth.account()?.getIdToken());

  canDeactivate() {
    return true;
  }
}
