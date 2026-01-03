import { effect, inject, Injectable, OnDestroy, signal } from "@angular/core";
import { filter } from "rxjs/operators";

import type { IEventOnStorage, TOrNoValue, TRecordJson } from "../../types";
import { schemaStoragePatch, schemaStoragePatchField } from "../../schemas";
import {
  AppConfigService,
  EmitterService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../utils";
import { TOKEN_localStorage } from "../../keys";

@Injectable({ providedIn: "root" })
export class LocalStorageService implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);
  private $subs = new ManageSubscriptionsService();
  //
  private localStorage = inject(TOKEN_localStorage);
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
          filter((event: any) => this.ON_STORAGE === this.$$.get(event, "type"))
        )
        .subscribe((event: IEventOnStorage<IEventOnStorage>) => {
          this.data.update((data_) =>
            data_ && "push" === event.action
              ? this.$$.transform(
                  event.payload,
                  (dd, value, path) => {
                    this.$$.set(dd, path, value);
                  },
                  this.$$.cloned(data_)
                )
              : this.$$.transform(
                  event.payload,
                  (dd, path) => {
                    this.$$.unset(dd, <string>path);
                  },
                  this.$$.cloned(data_)
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
      this.$$.onDebug({ ["LocalStorageService --sync"]: { error } });
    }
  }
  // swap x <=> y
  swap(path: string, x: any, y: any) {
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
      this.$$.onDebug({ ["LocalStorageService --sync"]: { error } });
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
