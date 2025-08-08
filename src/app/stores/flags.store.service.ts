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
    return this.store.update((storeCurrent) =>
      this.$$.assign(<ISToreFlagsCache>{}, storeCurrent, flags)
    );
  }
  on(name: string) {
    return this.push(<ISToreFlagsCache>{ [name]: true });
  }
  off(name: string) {
    return this.push(<ISToreFlagsCache>{ [name]: false });
  }
  toggle(name: string) {
    return this.store.update((storeCurrent) =>
      this.$$.assign(<ISToreFlagsCache>{}, storeCurrent, <ISToreFlagsCache>{
        [name]: !storeCurrent[name],
      })
    );
  }
  pull(name: string) {
    return this.$$.get(this.store(), name, false);
  }
  use(newStore: ISToreFlagsCache) {
    this.store.set(newStore);
    return this;
  }
}
