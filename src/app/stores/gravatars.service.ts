import { computed, effect, inject, Injectable } from "@angular/core";
import { catchError, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
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
export class GravatarsService {
  private readonly ERRIO = "@error:io:1d6b726f-0717-5897-80f9-18c9e3e8232e";
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $auth = inject(StoreAuth);
  private $subs = new ManageSubscriptionsService();
  readonly store = new UseCacheKeyService().use(this.$config.key.GRAVATARS);
  // @@
  readonly enabled = computed(() =>
    this.$$.parseBoolean(
      this.$$.get(this.store.data(), `${this.$auth.uid()}.enabled`)
    )
  );
  // @@
  readonly src = computed(() =>
    this.enabled()
      ? this.$$.get(this.store.data(), `${this.$auth.uid()}.src`)
      : ""
  );
  //
  constructor() {
    effect(() => {
      if (this.store.enabled()) this.start();
    });
  }
  // @@
  refresh() {
    return this.enabled()
      ? this.store.commit({ [this.$auth.uid()]: { src: this.url() } })
      : this.$$.empty$$();
  }
  // @@
  enable() {
    return this.enabled()
      ? this.$$.empty$$()
      : this.store.commit({ [this.$auth.uid()]: { enabled: true } });
  }
  // @@
  disable() {
    return this.enabled()
      ? this.store.commit({ [this.$auth.uid()]: { enabled: false } })
      : this.$$.empty$$();
  }
  //
  start() {
    this.$subs.push({
      onStore: this.store
        .io()
        .pipe(
          catchError(this.$$.empty$$),
          mergeMap(() => this.store.reload()),
          catchError(this.$$.empty$$)
        )
        .subscribe(),
    });
  }
  destroy() {
    this.$subs.destroy();
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
