import { Directive } from "@angular/core";

@Directive({
  selector: "[appOnclickAddClassOpen]",
  host: {
    "[class.open]": "isOpen",
    "(click)": "isOpen = !isOpen",
  },
})
export class OnclickAddClassOpenDirective {
  isOpen = false;
}
