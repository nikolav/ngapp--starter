import { Directive, inject } from "@angular/core";
import { StoreDataCache } from "../stores";

@Directive({
  selector: "[appProvideCache]",
  exportAs: "appProvideCache",
  providers: [StoreDataCache],
})
export class ProvideCacheDirective {
  readonly cache = inject(StoreDataCache);
  // constructor() {}
}
