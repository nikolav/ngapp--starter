import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import {
  CoreModulesShared,
  IconxModule,
  MaterialSharedModule,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth } from "../../stores";
import { DatetimeService, UseUtilsService } from "../../services";

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
export class AppComponent implements OnDestroy, OnInit {
  readonly $$ = inject(UseUtilsService);
  readonly $d = inject(DatetimeService);
  readonly $auth = inject(StoreAuth);
  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {}

  //
  ngOnInit() {}
  ngOnDestroy() {}
}
