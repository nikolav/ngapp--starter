import { Directive } from "@angular/core";
import { StoreDataCache } from "../stores";

@Directive({
  selector: "[ddemo]",
  host: {
    "(click)": "ok()",
  },
})
export class DdemoDirective {
  dd = new StoreDataCache();
  ok() {
    console.log("@cache", this.dd.data());
  }
}
