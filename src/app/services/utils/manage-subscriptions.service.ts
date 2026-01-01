import { inject, Injectable } from "@angular/core";

import { UseUtilsService } from "./use-utils.service";
import type { TManageSubscriptionsCache } from "../../types";

@Injectable()
export class ManageSubscriptionsService {
  protected $$ = inject(UseUtilsService);
  protected cache = <TManageSubscriptionsCache>{};

  clear(...keys: string[]) {
    keys.forEach((key) => {
      if (this.$$.hasOwn(this.cache, key)) {
        this.cache[key]?.unsubscribe();
        delete this.cache[key];
      }
    });
  }
  push(subs: TManageSubscriptionsCache) {
    this.$$.each(subs, (sub, key) => {
      this.cache[key]?.unsubscribe();
      this.cache[key] = sub;
    });
  }
  destroy() {
    this.$$.each(this.cache, (sub) => {
      sub?.unsubscribe();
    });
    this.use({});
  }
  use(newCache: TManageSubscriptionsCache) {
    this.cache = { ...newCache };
  }
}
