import { Component, computed, inject, OnDestroy } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import {
  CoreModulesShared,
  IconxModule,
  MaterialSharedModule,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth } from "../../stores";

@Component({
  selector: "page-app",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    AsyncPipe,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  readonly $auth = inject(StoreAuth);
  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {}

  //
  ngOnDestroy() {}
}
