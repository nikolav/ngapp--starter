import { inject, Injectable, signal } from "@angular/core";

import { UseUtilsService } from "../services";
import { ISToreFlagsCache } from "../types";

@Injectable({
  providedIn: "root",
})
export class StoreFlagsService {
  private $$ = inject(UseUtilsService);

  readonly data = signal(<ISToreFlagsCache>{});

  push(flags: ISToreFlagsCache) {
    this.data.update((d) => this.$$.copy(<ISToreFlagsCache>{}, d, flags));
  }
  on(name: string) {
    this.push(<ISToreFlagsCache>{ [name]: true });
  }
  off(name: string) {
    this.push(<ISToreFlagsCache>{ [name]: false });
  }
  toggle(name: string) {
    this.push(<ISToreFlagsCache>{ [name]: !this.item(name) });
  }
  item(name: string, DEFAULT = false) {
    return this.data()[name] ?? DEFAULT;
  }
  use(newStore: ISToreFlagsCache) {
    this.data.set(newStore);
    return this;
  }
}
