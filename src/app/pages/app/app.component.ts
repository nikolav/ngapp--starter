import { Component, computed, inject, OnDestroy } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import {
  CoreModulesShared,
  IconxModule,
  MaterialSharedModule,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth } from "../../stores";
import { UseUtilsService } from "../../services";

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
  $$ = inject(UseUtilsService);
  readonly $auth = inject(StoreAuth);
  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {}

  //
  ngOnDestroy() {}
}
