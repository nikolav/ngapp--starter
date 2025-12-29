import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  input,
} from "@angular/core";
import { Subject } from "rxjs";

import { UseToggleFlagService } from "../../services";

@Directive({
  selector: "[appSelectableItem]",
  exportAs: "appSelectableItem",
})
export class SelectableItemDirective {
  protected $toggleIsSelected = new UseToggleFlagService();

  // @@
  readonly disabled = input(false, {
    alias: "appSelectableItemDisabled",
    transform: booleanAttribute,
  });

  // @@
  readonly isSelected = computed(() =>
    this.disabled() ? false : this.$toggleIsSelected.isActive()
  );

  readonly change = new Subject<boolean>();

  constructor() {
    effect(() => {
      this.change.next(this.isSelected());
    });
  }

  toggle(SELECTED?: boolean) {
    if (this.disabled()) return;
    this.$toggleIsSelected.toggle(SELECTED);
  }
}
