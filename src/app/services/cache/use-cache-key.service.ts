import { Injectable, computed, inject, signal, effect } from "@angular/core";
import { Socket } from "ngx-socket-io";

import {
  TopicsService,
  CacheService,
  ManageSubscriptionsService,
} from "../../services";
import { TOrNoValue } from "../../types";
import { StoreAuth } from "../../stores";

@Injectable()
export class UseCacheKeyService {
  private $io = inject(Socket);
  private $auth = inject(StoreAuth);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  private cache_key = signal<TOrNoValue<string>>(undefined);
  private q = computed(() => this.$cache.key(this.cache_key()));
  private $subs = new ManageSubscriptionsService();
  // #public
  readonly enabled = computed(
    () => this.$auth.isAuthApi() && Boolean(this.cache_key())
  );
  readonly data = signal<any>(undefined);
  readonly io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(this.cache_key()))
      : undefined
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
  async reload() {
    return await this.q()?.refetch();
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
