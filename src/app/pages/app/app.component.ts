import { Component, computed, effect, inject, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AsyncPipe, JsonPipe } from "@angular/common";

import { MaterialSharedModule } from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth } from "../../stores";
import {
  ManageSubscriptionsService,
  UseCacheKeyService,
  UseUtilsService,
} from "../../services";
import { catchError, mergeMap, of } from "rxjs";

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
  private $subs = new ManageSubscriptionsService();
  readonly $cache = new UseCacheKeyService().use(
    "@cc:c891f690-e661-5690-a31d-786878712397"
  );

  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {
    // @cache:io reload
    const iofield = "onio";
    effect((cleanup) => {
      if (this.$cache.enabled()) this.cacheIOStart(iofield);
      cleanup(() => this.$subs.clear(iofield));
    });
  }

  cacheIOStart(field: any) {
    this.$subs.push({
      [field]: this.$cache
        .io()
        .pipe(
          catchError(() => of(UseCacheKeyService.ERR_IO)),
          mergeMap((res) =>
            UseCacheKeyService.ERR_IO == res
              ? this.$$.null$$()
              : this.$cache.reload()
          ),
          catchError(this.$$.null$$)
        )
        .subscribe(),
    });
  }

  cachePush() {
    this.$cache
      .commit({ foo: Math.random() })
      .pipe(catchError(this.$$.null$$))
      .subscribe();
  }

  destroy() {
    this.$subs.destroy();
  }

  //
  ngOnDestroy() {
    this.destroy();
  }
}
