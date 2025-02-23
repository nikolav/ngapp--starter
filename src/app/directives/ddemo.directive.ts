import { Directive } from "@angular/core";

@Directive({
  selector: "[ddemo]",
  host: {
    "(click)": "ok()",
  },
})
export class DdemoDirective {
  ok() {
    console.log("ddemo.d");
  }
}
