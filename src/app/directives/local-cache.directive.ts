import { Directive } from "@angular/core";

import { StoreDataCache } from "../stores";

@Directive({
  selector: "[appLocalCache]",
  exportAs: "appLocalCache",
})
export class LocalCacheDirective {
  readonly cache = new StoreDataCache();
}
