import { inject, Injectable, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { filter as op_filter } from "rxjs/operators";

import {
  AppConfigService,
  UseUtilsService,
  EmitterService,
} from "../../services";
import { TOrNoValue } from "../../types";
import { schemaStoragePatch, schemaStoragePatchField } from "../../schemas";

interface IEventOnStorage {
  type: string;
  payload: any;
  drop?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);

  private ON_STORAGE = this.$config.events.STORAGE_CHANGE;
  private store_s: TOrNoValue<Subscription>;

  localStorage = inject(this.$config.di.TOKEN_localStorage);
  data = signal<any>({});

  constructor() {
    // @storage pull
    this.store_s = this.$emitter.subject
      .pipe(
        op_filter(
          (event: IEventOnStorage) =>
            this.ON_STORAGE === this.$$.get(event, "type")
        )
      )
      .subscribe((event: IEventOnStorage) => {
        this.data.update((data_) =>
          true === this.$$.get(event, "drop")
            ? this.$$.omit(data_, event.payload)
            : this.$$.assign({}, data_, event.payload)
        );
      });
    // @init load
    this.sync();
  }
  set(field: string, value: string) {
    try {
      const payload = schemaStoragePatch.parse({ [field]: value });
      this.localStorage.setItem(field, value);
      this.$emitter.subject.next(<IEventOnStorage>{
        type: this.ON_STORAGE,
        payload,
      });
    } catch (error) {
      console.log("@debug:LocalStorageService --set");
      console.log(error);
    }
  }
  drop(field: any) {
    try {
      const payload = schemaStoragePatchField.parse(field);
      this.localStorage.removeItem(field);
      this.$emitter.subject.next(<IEventOnStorage>{
        type: this.ON_STORAGE,
        payload,
        drop: true,
      });
    } catch (error) {
      console.log("@debug:LocalStorageService --drop");
      console.log(error);
    }
  }
  sync() {
    // load Storage
    const store_ = <any>{};
    try {
      for (let i = 0, l = this.localStorage.length; i < l; i++) {
        const field = this.localStorage.key(i);
        if (field) {
          store_[field] = this.localStorage.getItem(field);
        }
      }
      this.data.set(store_);
    } catch (error) {
      console.log("@debug:LocalStorageService --sync");
      console.log(error);
    }
  }
  destroy() {
    this.store_s?.unsubscribe();
  }
}
