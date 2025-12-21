import { Component, computed, effect, inject, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AsyncPipe, JsonPipe } from "@angular/common";

import { MaterialSharedModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth, StoreGravatars } from "../../stores";
import {
  CollectionsService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../../services";
import { catchError, map, mergeMap, of } from "rxjs";

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
export class AppComponent implements OnDestroy {
  readonly $auth = inject(StoreAuth);
  private $$ = inject(UseUtilsService);
  private $sbs = new ManageSubscriptionsService();
  readonly $coll = CollectionsService.init(
    "coll:083438bb-e00d-5a6e-9ae2-4617f25580c0"
  );
  readonly $g = inject(StoreGravatars);

  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {
    const iocoll = "iocoll";
    effect((cleanup) => {
      if (!this.$coll.enabled()) return;
      this.startCollIO(iocoll);
      cleanup(() => this.$sbs.clear(iocoll));
    });
  }

  startCollIO(field: any) {
    this.$sbs.push({
      [field]: this.$coll
        .io()
        .pipe(
          mergeMap(() =>
            this.$coll.reload().pipe(map((res) => this.$$.res.init(res, null)))
          ),
          catchError((error) => of(this.$$.res.init(null, error)))
        )
        .subscribe(),
    });
  }

  collPush() {
    this.$coll
      .commit([
        {
          data: {
            data: {
              "x:1": this.$$.idGen(),
              "x:2": this.$$.idGen(),
            },
          },
        },
      ])
      .pipe(catchError(this.$$.empty$$))
      .subscribe();
  }

  destroy() {
    this.$sbs.destroy();
  }

  //
  ngOnDestroy() {
    this.destroy();
  }
}
