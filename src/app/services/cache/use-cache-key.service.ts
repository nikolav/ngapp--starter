import {
  Injectable,
  computed,
  inject,
  signal,
  OnDestroy,
  effect,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Socket } from "ngx-socket-io";

import { TopicsService, CacheService } from "../../services";
import { TOrNoValue } from "../../types";

@Injectable()
export class UseCacheKeyService implements OnDestroy {
  private $io = inject(Socket);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  private cache_key = signal<TOrNoValue<string>>(undefined);
  private q_s: TOrNoValue<Subscription>;
  private q = computed(() => this.$cache.key(this.cache_key()));
  // #public
  enabled = computed(() => Boolean(this.cache_key()));
  data = signal<any>(undefined);
  io = computed(() =>
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
    this.q_s?.unsubscribe();
  }
  start() {
    this.q_s = this.q()?.valueChanges.subscribe((res) =>
      this.data.set(this.$cache.data(res, this.cache_key()))
    );
  }
  use(key: string) {
    this.cache_key.set(key);
    return this;
  }
  ngOnDestroy() {
    this.destroy();
  }
}
