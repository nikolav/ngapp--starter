import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  input,
} from "@angular/core";
import { Subject } from "rxjs";

import { UseToggleFlagService } from "../../services";
import { TOrNoValue } from "../../types";

@Directive({
  selector: "[appSelectableItem]",
  exportAs: "appSelectableItem",
})
export class SelectableItemDirective {
  protected $toggleIsSelected = new UseToggleFlagService();

  // @@
  readonly name = input<TOrNoValue<string>>(null, {
    alias: "appSelectableItemName",
  });

  // @@
  readonly disabled = input(false, {
    alias: "appSelectableItemDisabled",
    transform: booleanAttribute,
  });

  readonly change = new Subject<boolean>();

  // @@
  readonly isSelected = computed(() =>
    this.disabled() ? false : this.$toggleIsSelected.isActive()
  );

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
