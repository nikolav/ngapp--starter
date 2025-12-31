import { Injectable, signal, inject } from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable()
export class DataCacheService {
  private $$ = inject(UseUtilsService);

  // @@
  readonly data = signal(<any>{});

  // @@
  item(path: string) {
    return this.$$.get(this.data(), path);
  }

  // @@
  push(patch: Record<string, any>) {
    this.data.update((d) =>
      this.$$.reduce(
        patch,
        (accum, value, path) => {
          this.$$.set(accum, path, value);
          return accum;
        },
        this.$$.cloned(d)
      )
    );
  }

  // @@
  pull(fields: Record<string, string> | string) {
    // .pull({'x1': 'foo.bar[1]', 'x2': 'bax.y1'})
    return this.$$.reduce(
      this.$$.isString(fields) ? { [fields]: fields } : fields,
      (accum, path, fieldOrPath) => {
        this.$$.set(accum, fieldOrPath, this.item(path));
        return accum;
      },
      <any>{}
    );
  }

  // @@
  unset(...paths: string[]) {
    this.data.update((d) =>
      this.$$.reduce(
        paths,
        (accum, path) => {
          this.$$.unset(accum, path);
          return accum;
        },
        this.$$.cloned(d)
      )
    );
  }

  use(store: any) {
    this.data.set(store);
    return this;
  }

  clear() {
    this.use(<any>{});
  }
}
