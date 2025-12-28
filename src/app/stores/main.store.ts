import { Injectable, inject, signal } from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class StoreMain {
  private $$ = inject(UseUtilsService);

  readonly store = signal(<any>{});

  push(patch: any) {
    this.store.update((store_) =>
      this.$$.reduce(
        patch,
        (acc, value, path) => {
          this.$$.set(acc, path, value);
          return acc;
        },
        this.$$.structuredClone(store_)
      )
    );
  }
  // pull({ 'a': 'foo.bar[1]', 'b': 'x.y' })
  pull(fields: Record<string, string>) {
    return this.$$.reduce(
      fields,
      (acc, path, field) => {
        this.$$.set(acc, field, this.item(path));
        return acc;
      },
      <any>{}
    );
  }
  item(path: string, DEFAULT?: any) {
    return this.$$.get(this.store(), path, DEFAULT);
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
        (acc, path) => {
          this.$$.unset(acc, path);
          return acc;
        },
        this.$$.structuredClone(store_)
      )
    );
  }
}
