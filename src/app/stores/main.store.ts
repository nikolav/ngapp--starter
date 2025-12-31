import { Injectable, inject, signal } from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class StoreMain {
  private $$ = inject(UseUtilsService);

  readonly data = signal(<any>{});

  push(patch: any) {
    this.data.update((d) =>
      this.$$.reduce(
        patch,
        (acc, value, path) => {
          this.$$.set(acc, path, value);
          return acc;
        },
        this.$$.cloned(d)
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
    return this.$$.get(this.data(), path, DEFAULT);
  }
  has(path: string) {
    return this.$$.has(this.data(), path);
  }
  use(newStore: any) {
    this.data.set(newStore);
    return this;
  }
  unset(...paths: string[]) {
    this.data.update((d) =>
      this.$$.reduce(
        paths,
        (acc, path) => {
          this.$$.unset(acc, path);
          return acc;
        },
        this.$$.cloned(d)
      )
    );
  }
}
