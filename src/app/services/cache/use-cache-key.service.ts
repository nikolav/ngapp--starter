import { Injectable, computed, inject, signal, effect } from "@angular/core";
import { from } from "rxjs";
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
  static readonly ERR_IO = "ERR_IO:74f6d3b0-819d-54ed-b43c-4236024e0da8";

  protected $io = inject(Socket);

  protected $$ = inject(UseUtilsService);
  protected $auth = inject(StoreAuth);
  protected $topics = inject(TopicsService);

  readonly $cache = inject(CacheService);

  protected $s = new ManageSubscriptionsService();

  protected cache_key = signal<TOrNoValue<string>>(undefined);
  // @@
  readonly enabled = computed(
    () => Boolean(this.cache_key()) && this.$auth.isAuthApi()
  );
  protected q = computed(() => this.$cache.key(this.cache_key()));

  // @@
  readonly data = signal<any>(undefined);

  // @@
  readonly io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(this.cache_key()))
      : this.$$.error$$()
  );

  constructor() {
    effect((cleanup) => {
      if (!this.enabled()) return;
      this.start();
      cleanup(() => {
        this.data.set(undefined);
      });
    });
  }

  // @@
  commit(patch: any, merge = true) {
    return this.$cache.commit(this.cache_key(), patch, merge);
  }

  // @@
  drop(paths: string[], separator?: string) {
    return this.$cache.drop(this.cache_key(), paths, separator);
  }

  // @@
  reload() {
    return from(this.q() ? this.q()!.refetch() : Promise.reject());
  }

  // @@
  use(key: string) {
    this.cache_key.set(key);
    return this;
  }

  start() {
    this.$s.push({
      data: this.q()?.valueChanges.subscribe((res) =>
        this.data.set(this.$cache.data(res, this.cache_key()))
      ),
    });
  }

  destroy() {
    this.$s.destroy();
  }
}
