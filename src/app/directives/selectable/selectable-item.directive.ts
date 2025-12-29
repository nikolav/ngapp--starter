import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from "@angular/core";

import { SelectableHasItemsDirective } from "./selectable-has-items.directive";
import { UseUtilsService } from "../../services";

@Directive({
  selector: "[appSelectableItem]",
  exportAs: "appSelectableItem",
})
export class SelectableItemDirective {
  protected $$ = inject(UseUtilsService);

  readonly container = inject(SelectableHasItemsDirective);

  // @@
  readonly disabled = input(false, {
    alias: "appSelectableItemDisabled",
    transform: booleanAttribute,
  });

  // @@
  readonly isSelected = computed(() =>
    this.$$.includes(this.container.currentSelection(), this)
  );

  toggle(SELECTED?: boolean) {
    this.container.toggleItem(this, SELECTED);
  }
}
