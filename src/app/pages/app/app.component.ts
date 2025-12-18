import { Component, computed, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AsyncPipe, JsonPipe } from "@angular/common";

import { MaterialSharedModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth, StoreGravatars } from "../../stores";

@Component({
  selector: "page-app",
  imports: [
    LayoutDefault,
    MaterialSharedModule,
    RouterModule,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  readonly $auth = inject(StoreAuth);
  readonly $g = inject(StoreGravatars);

  idToken = computed(() => this.$auth.account()?.getIdToken());
}
