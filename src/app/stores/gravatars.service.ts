import { computed, effect, inject, Injectable, OnDestroy } from "@angular/core";
import { StoreAuth } from "./auth.store";
import {
  AppConfigService,
  ManageSubscriptionsService,
  UseCacheKeyService,
  UseUtilsService,
} from "../services";

// type TGravatarsCache = Record<string, { enabled: boolean; src: string }>;

@Injectable({
  providedIn: "root",
})
export class GravatarsService implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $auth = inject(StoreAuth);
  private $subs = new ManageSubscriptionsService();
  //
  readonly store = new UseCacheKeyService().use(this.$config.key.GRAVATARS);
  readonly enabled = computed(
    () =>
      this.$auth.isAuth() &&
      false !== this.$$.get(this.store.data(), `[${this.$auth.uid()}].enabled`)
  );
  readonly src = computed(() =>
    this.enabled()
      ? this.$$.get(this.store.data(), `[${this.$auth.uid()}].src`)
      : ""
  );
  //
  constructor() {
    effect(() => {
      if (this.enabled()) this.start();
    });
  }
  //
  refresh() {
    if (this.enabled())
      this.store
        .commit({ [this.$auth.uid()]: { src: this.url() } })
        ?.subscribe();
  }
  enable() {
    return this.store
      .commit({ [this.$auth.uid()]: { enabled: true } })
      ?.subscribe();
  }
  disable() {
    return this.store
      .commit({ [this.$auth.uid()]: { enabled: false } })
      ?.subscribe();
  }
  //
  start() {
    this.$subs.push({
      _s1: this.store.io()?.subscribe(() => {
        this.store.reload();
      }),
    });
  }
  destroy() {
    this.$subs.destroy();
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
  //
  private url() {
    return `${this.$$.trimEnd(
      this.$config.stores.gravatars.BASE_URL,
      "/"
    )}/${this.$$.md5(this.email())}?d=${this.gmode()}&size=${
      this.$config.stores.gravatars.SIZE
    }`;
  }
  private email() {
    return `g.${this.$$.idGen()}@gravatar.com`.toLocaleLowerCase();
  }
  private gmode() {
    return this.$$.sample(
      this.$$.reduce(
        this.$config.stores.gravatars.MODE,
        (res, val, field) => {
          if (true === val) res.push(field);
          return res;
        },
        <string[]>[]
      )
    );
  }
}
