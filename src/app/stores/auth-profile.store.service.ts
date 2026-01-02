import { computed, effect, inject, Injectable, OnDestroy } from "@angular/core";
import { catchError, mergeMap } from "rxjs/operators";

import {
  ManageSubscriptionsService,
  TopicsService,
  UseCacheKeyService,
  UseUtilsService,
} from "../services";
import { StoreAuth } from "./auth.store";

@Injectable({
  providedIn: "root",
})
export class StoreAuthProfile implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $auth = inject(StoreAuth);
  private $topics = inject(TopicsService);

  private $subs = new ManageSubscriptionsService();

  // @@
  readonly profile = new UseCacheKeyService();

  readonly profileCacheKey = computed(() =>
    this.$topics.authProfile(this.$auth.uid())
  );

  constructor() {
    effect(() => {
      this.profile.use(this.profileCacheKey());
    });

    effect(() => {
      this.$subs.push({
        profile_io: this.profile
          .io()
          .pipe(
            mergeMap(() => this.profile.reload()),
            catchError(() => this.$$.empty$$())
          )
          .subscribe(),
      });
    });
  }

  destroy() {
    this.$subs.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
