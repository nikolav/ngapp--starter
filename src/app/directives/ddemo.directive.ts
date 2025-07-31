import { Directive, inject } from "@angular/core";
import { StoreDataCache } from "../stores";

@Directive({
  selector: "[ddemo]",
  host: {
    "(click)": "ok()",
  },
})
export class DdemoDirective {
  dd = inject(StoreDataCache);
  ok() {
    console.log("@cache", this.dd.cache());
  }
}
