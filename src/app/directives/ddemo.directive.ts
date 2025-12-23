import { Directive } from "@angular/core";
import { StoreDataCache } from "../stores";

@Directive({
  selector: "[ddemo]",
  exportAs: "ddemo",
  host: {
    "(click)": "onClick()",
  },
})
export class DdemoDirective {
  readonly dd = new StoreDataCache();
  onClick() {
    console.log("@cache DdemoDirective", this.dd.data());
  }
}
