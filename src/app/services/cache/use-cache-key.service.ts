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
// import { take as op_take } from "rxjs/operators";
import { Socket } from "ngx-socket-io";

@Injectable()
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
  use(key: string) {
    this.cache_key.set(key);
    return this;
  }
  commit(patch: any, merge = true) {
    return this.$cache.commit(this.cache_key(), patch, merge);
  }
  start() {
    this.q_s = this.q()?.valueChanges.subscribe((res) =>
      this.data.set(this.$cache.data(res, this.cache_key()))
    );
  }
  async reload() {
    return await this.q()?.refetch();
  }
  destroy() {
    this.q_s?.unsubscribe();
  }
  // #magic
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
  ngOnDestroy() {
    this.destroy();
  }
}
