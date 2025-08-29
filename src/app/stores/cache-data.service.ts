import { Injectable, signal, inject } from "@angular/core";
import { UseUtilsService } from "../services";

@Injectable()
export class DataCacheService {
  private empty_ = () => <any>{};
  private $$ = inject(UseUtilsService);
  //
  readonly cache = signal(<any>{});
  //
  item(path: string) {
    return this.$$.get(this.cache(), path);
  }
  push(patch: Record<string, any>) {
    this.cache.update((d) =>
      this.$$.reduce(
        patch,
        (dd, value, path) => {
          this.$$.set(dd, path, value);
          return dd;
        },
        this.$$.clone(d)
      )
    );
  }
  pull(fields: Record<string, string> | string) {
    // .pull({'x1': 'foo.bar[1]', 'x2': 'bax.y1'})
    const cc = this.cache();
    return this.$$.reduce(
      this.$$.isString(fields) ? { [fields]: fields } : fields,
      (dd, path, field) => {
        this.$$.set(dd, field, this.$$.get(cc, path));
        return dd;
      },
      <any>{}
    );
  }
  unset(...paths: string[]) {
    this.cache.update((d) =>
      this.$$.reduce(
        paths,
        (dd, path) => {
          this.$$.unset(dd, path);
          return dd;
        },
        this.$$.clone(d)
      )
    );
  }
  use(store: any) {
    this.cache.set(store);
    return this;
  }
  destroy() {
    this.cache.set(this.empty_());
  }
}
