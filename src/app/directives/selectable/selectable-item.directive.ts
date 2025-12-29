import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from "@angular/core";

import { SelectableHasItemsDirective } from "./selectable-has-items.directive";
import { StoreDataCache } from "../../stores";

@Directive({
  selector: "[appSelectableItem]",
  exportAs: "appSelectableItem",
})
export class SelectableItemDirective {
  readonly container = inject(SelectableHasItemsDirective, { optional: false });

  readonly cache = inject(StoreDataCache);
  readonly data = new StoreDataCache();

  // @@
  readonly disabled = input(false, {
    alias: "appSelectableItemDisabled",
    transform: booleanAttribute,
  });

  // @@
  readonly isSelected = computed(() =>
    this.container.selection.isSelected(this)
  );

  select(SELECTED = true) {
    this.container.selectItem(this, SELECTED);
  }
}
