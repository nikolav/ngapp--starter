import { computed, effect, inject, Injectable, OnDestroy } from "@angular/core";
import { catchError } from "rxjs/operators";

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

  private $s = new ManageSubscriptionsService();

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
      this.$s.push({
        profile_io: this.profile
          .io()
          .pipe(catchError(() => this.$$.empty$$()))
          .subscribe(() => {
            this.profile.reload().subscribe();
          }),
      });
    });
  }

  destroy() {
    this.$s.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
