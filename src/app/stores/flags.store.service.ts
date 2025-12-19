import { inject, Injectable, signal } from "@angular/core";
import { UseUtilsService } from "../services";
import { ISToreFlagsCache } from "../types";

@Injectable({
  providedIn: "root",
})
export class StoreFlagsService {
  private $$ = inject(UseUtilsService);

  readonly store = signal(<ISToreFlagsCache>{});

  push(flags: ISToreFlagsCache) {
    this.store.update((storeCurrent) =>
      this.$$.copy(<ISToreFlagsCache>{}, storeCurrent, flags)
    );
  }
  on(name: string) {
    this.push(<ISToreFlagsCache>{ [name]: true });
  }
  off(name: string) {
    this.push(<ISToreFlagsCache>{ [name]: false });
  }
  toggle(name: string) {
    this.store.update((storeCurrent) =>
      this.$$.copy(<ISToreFlagsCache>{}, storeCurrent, {
        [name]: !storeCurrent[name],
      })
    );
  }
  item(name: string) {
    return Boolean(this.store()[name]);
  }
  use(newStore: ISToreFlagsCache) {
    this.store.set(newStore);
    return this;
  }
}
