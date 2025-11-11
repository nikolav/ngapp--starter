import { Injectable, inject, signal } from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class StoreMain {
  private $$ = inject(UseUtilsService);

  store = signal(<any>{});

  push(patch: any) {
    this.store.update((store_) =>
      this.$$.reduce(
        patch,
        (res, value, path) => {
          this.$$.set(res, path, value);
          return res;
        },
        this.$$.clone(store_)
      )
    );
  }
  // pull({ 'a': 'foo.bar[1]', 'b': 'x.y' })
  pull(fields: Record<string, string>) {
    const store_ = this.store();
    return this.$$.reduce(
      fields,
      (res, path, field) => {
        this.$$.set(res, field, this.$$.get(store_, path));
        return res;
      },
      <any>{}
    );
  }
  item(path: string) {
    return this.pull({ value: path })["value"];
  }
  exists(path: string) {
    return this.$$.has(this.store(), path);
  }
  use(newStore: any) {
    this.store.set(newStore);
    return this;
  }
  unset(...paths: string[]) {
    this.store.update((store_) =>
      this.$$.reduce(
        paths,
        (res, path) => {
          this.$$.unset(res, path);
          return res;
        },
        this.$$.clone(store_)
      )
    );
  }
}
