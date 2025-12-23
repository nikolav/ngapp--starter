import { Directive } from "@angular/core";
import { UseToggleFlagService } from "../services";

@Directive({
  selector: "[appOnclickAddClassOpen]",
  host: {
    "[class.open]": "toggleIsOpen.isActive()",
    "(click)": "toggleIsOpen.toggle()",
  },
})
export class OnclickAddClassOpenDirective {
  readonly toggleIsOpen = new UseToggleFlagService();
}
