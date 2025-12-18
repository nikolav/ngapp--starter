import { Injectable, computed, inject, signal, effect } from "@angular/core";
import { from as oFrom } from "rxjs";
import { Socket } from "ngx-socket-io";

import {
  TopicsService,
  CacheService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../../services";
import { TOrNoValue } from "../../types";
import { StoreAuth } from "../../stores";

@Injectable()
export class UseCacheKeyService {
  private $io = inject(Socket);
  private $auth = inject(StoreAuth);
  private $topics = inject(TopicsService);
  private $$ = inject(UseUtilsService);
  private $subs = new ManageSubscriptionsService();
  readonly $cache = inject(CacheService);

  private cache_key = signal<TOrNoValue<string>>(undefined);
  private q = computed(() => this.$cache.key(this.cache_key()));
  // #public
  readonly enabled = computed(
    () => this.$auth.isAuthApi() && Boolean(this.cache_key())
  );
  readonly data = signal<any>(undefined);
  readonly io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(this.cache_key()))
      : this.$$.error$$()
  );
  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      this.start();
      onCleanup(() => {
        this.destroy();
        this.data.set(undefined);
      });
    });
  }
  commit(patch: any, merge = true) {
    return this.$cache.commit(this.cache_key(), patch, merge);
  }
  reload() {
    const q = this.q();
    return oFrom(q ? q.refetch() : Promise.reject());
  }
  destroy() {
    this.$subs.destroy();
  }
  start() {
    this.$subs.push({
      data: this.q()?.valueChanges.subscribe((res) =>
        this.data.set(this.$cache.data(res, this.cache_key()))
      ),
    });
  }
  use(key: string) {
    this.cache_key.set(key);
    return this;
  }
}
