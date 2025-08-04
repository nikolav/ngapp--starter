import { Injectable, signal, inject } from "@angular/core";
import { UseUtilsService } from "../services";

@Injectable()
export class DataCacheService {
  private empty_ = () => <any>{};
  private $$ = inject(UseUtilsService);
  //
  cache = signal<any>({});
  //
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
    const d = this.cache();
    return this.$$.reduce(
      this.$$.isString(fields) ? { [fields]: fields } : fields,
      (dd, path, field) => {
        this.$$.set(dd, field, this.$$.get(d, path));
        return dd;
      },
      <any>{}
    );
  }
  unset(...paths: string[]) {
    this.cache.update((d) => {
      const res = this.$$.clone(d);
      this.$$.each(paths, (path) => this.$$.unset(res, path));
      return res;
    });
  }
  use(store: any) {
    this.cache.set(store);
    return this;
  }
  destroy() {
    this.cache.set(this.empty_());
  }
}
