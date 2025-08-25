import { inject, Injectable } from "@angular/core";
import { UseUtilsService } from "./use-utils.service";
import { TManageSubscriptionsCache } from "../../types";

@Injectable()
export class ManageSubscriptionsService {
  private $$ = inject(UseUtilsService);
  private cache = <TManageSubscriptionsCache>{};

  clear(...keys: string[]) {
    keys.forEach((key) => {
      if (this.$$.coreHasOwn(this.cache, key)) {
        this.cache[key].unsubscribe();
        delete this.cache[key];
      }
    });
  }
  push(subs: TManageSubscriptionsCache) {
    this.$$.each(subs, (sub, key) => {
      if (this.$$.coreHasOwn(this.cache, key)) {
        this.cache[key].unsubscribe();
      }
      this.cache[key] = sub;
    });
  }
  destroy() {
    this.$$.each(this.cache, (sub) => {
      sub.unsubscribe();
    });
    this.use({});
  }
  use(newCache: TManageSubscriptionsCache) {
    this.cache = newCache;
  }
}
