import {
  Injectable,
  computed,
  inject,
  signal,
  OnDestroy,
  effect,
} from "@angular/core";
import { TopicsService, CacheService } from "../../services";
import { TOrNoValue } from "../../types";
import { Subscription } from "rxjs";
import { take as op_take } from "rxjs/operators";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class UseCacheKeyService implements OnDestroy {
  private $io = inject(Socket);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  private cache_key = signal<TOrNoValue<string>>(undefined);
  private q_s: TOrNoValue<Subscription>;
  private q = computed(() => this.$cache.key(this.cache_key()));
  // #public
  enabled = computed(() => !!this.cache_key());
  data = signal<any>(undefined);
  io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(this.cache_key()))
      : undefined
  );
  async commit(patch: any, merge = true) {
    return await new Promise((resolve) =>
      this.$cache
        .commit(this.cache_key(), patch, merge)
        ?.pipe(op_take(1))
        .subscribe(resolve)
    );
  }
  async reload() {
    return await this.q()?.refetch();
  }
  use(key: string) {
    this.cache_key.set(key);
    return this;
  }
  start() {
    if (this.enabled()) {
      this.q_s = this.q()?.valueChanges.subscribe((res) =>
        this.data.set(this.$cache.data(res, this.cache_key()))
      );
    }
  }
  destroy() {
    this.q_s?.unsubscribe();
  }
  // #magic
  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.start();
      } else {
        this.destroy();
      }
    });
  }
  ngOnDestroy() {
    this.destroy();
  }
}
