import { effect, inject, Injectable, OnDestroy, signal } from "@angular/core";
import { filter as opFilter } from "rxjs/operators";

import { schemaStoragePatch, schemaStoragePatchField } from "../../schemas";
import { IEventOnStorage, TOrNoValue, TRecordJson } from "../../types";
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
  readonly data = signal<TOrNoValue<TRecordJson>>(null);
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
      data: this.$emitter.subject
        .pipe(
          opFilter(
            (event: any) => this.ON_STORAGE === this.$$.get(event, "type")
          )
        )
        .subscribe((event: IEventOnStorage) => {
          this.data.update((data_) =>
            data_ && "push" === event.action
              ? this.$$.reduce(
                  event.payload,
                  (dd, value, path) => {
                    this.$$.set(dd, path, value);
                    return dd;
                  },
                  this.$$.clone(data_)
                )
              : this.$$.reduce(
                  event.payload,
                  (dd, path) => {
                    this.$$.unset(dd, path);
                    return dd;
                  },
                  this.$$.clone(data_)
                )
          );
        }),
    });
  }
  item(path: string) {
    return this.$$.get(this.data(), path);
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
      this.$$.onDebug("LocalStorageService --sync", error);
    }
  }
  // switch x <=> y
  switch(path: string, x: any, y: any) {
    this.push({ [path]: x != this.item(path) ? x : y });
  }
  drop(...paths: string[]) {
    try {
      const payload = paths.map((path) => schemaStoragePatchField.parse(path));
      this.$emitter.subject.next(<IEventOnStorage>{
        type: this.ON_STORAGE,
        payload,
        action: "drop",
      });
    } catch (error) {
      this.$$.onDebug("LocalStorageService --sync", error);
    }
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
  destroy() {
    this.$subs.destroy();
  }
  sync() {
    this.data.set(JSON.parse(this.localStorage.getItem(this.STORAGE) ?? "{}"));
  }
  dump() {
    if (this.data())
      this.localStorage.setItem(this.STORAGE, JSON.stringify(this.data()));
  }
}
