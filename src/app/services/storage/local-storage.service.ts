import { effect, inject, Injectable, OnDestroy, signal } from "@angular/core";
import { filter as op_filter } from "rxjs/operators";

import { schemaStoragePatch, schemaStoragePatchField } from "../../schemas";
import { IEventOnStorage, TRecordJson } from "../../types";
import {
  AppConfigService,
  EmitterService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../utils";

@Injectable({ providedIn: "root" })
export class LocalStorageService implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);
  private $subs = new ManageSubscriptionsService();
  //
  private localStorage = inject(this.$config.di.TOKEN_localStorage);
  private ON_STORAGE = this.$config.events.STORAGE_CHANGE;
  private STORAGE = this.$config.key.STORAGE;
  //
  readonly enabled = signal(true);
  readonly data = signal<TRecordJson>({});
  //
  constructor() {
    // sync cache and storage
    effect(() => {
      this.dump();
    });
    // load on enabled
    effect((onCleanup) => {
      if (!this.enabled()) return;
      this.start();
      onCleanup(() => {
        this.destroy();
      });
    });
  }
  //
  start() {
    this.sync();
    this.$subs.push({
      _s1: this.$emitter.subject
        .pipe(
          op_filter(
            (event: any) => this.ON_STORAGE === this.$$.get(event, "type")
          )
        )
        .subscribe((event: IEventOnStorage) => {
          this.data.update((data_) =>
            "push" === event.action
              ? this.$$.assign({}, data_, event.payload)
              : this.$$.reduce(
                  event.payload,
                  (dd, key) => {
                    delete dd[key];
                    return dd;
                  },
                  this.$$.clone(data_)
                )
          );
        }),
    });
  }
  push(patch: TRecordJson) {
    try {
      const payload = schemaStoragePatch.parse(patch);
      this.$emitter.subject.next(<IEventOnStorage>{
        type: this.ON_STORAGE,
        payload,
        action: "push",
      });
    } catch (error) {
      this.$$.onDebug("LocalStorage2Service --sync", error);
    }
  }
  drop(...keys: string[]) {
    try {
      const payload = keys.map((key) => schemaStoragePatchField.parse(key));
      this.$emitter.subject.next(<IEventOnStorage>{
        type: this.ON_STORAGE,
        payload,
        action: "drop",
      });
    } catch (error) {
      this.$$.onDebug("LocalStorage2Service --sync", error);
    }
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
  destroy() {
    this.$subs.destroy();
    this.data.set({});
  }
  sync() {
    this.data.set(JSON.parse(this.localStorage.getItem(this.STORAGE) ?? "{}"));
  }
  dump() {
    this.localStorage.setItem(this.STORAGE, JSON.stringify(this.data()));
  }
}
