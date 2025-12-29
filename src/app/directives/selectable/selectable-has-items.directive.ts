import {
  booleanAttribute,
  contentChildren,
  Directive,
  effect,
  inject,
  input,
} from "@angular/core";
import { of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";

import { UseUtilsService } from "../../services";
import { SelectableItemDirective } from "./selectable-item.directive";

@Directive({
  selector: "[appSelectable]",
  exportAs: "appSelectable",
})
export class SelectableHasItemsDirective {
  protected $$ = inject(UseUtilsService);

  // @@
  readonly multiple = input(false, {
    alias: "appSelectableMultiple",
    transform: booleanAttribute,
  });
  readonly disabled = input(false, {
    alias: "appSelectableDisabled",
    transform: booleanAttribute,
  });

  readonly items = contentChildren(SelectableItemDirective);
  readonly selection = new SelectionModel<SelectableItemDirective>(
    this.multiple()
  );

  readonly selections$ = this.selection.changed.pipe(
    mergeMap(() => of(this.selection.selected))
  );

  constructor() {
    // deselect removed items
    effect(() => {
      this.selection.deselect(
        ...this.$$.difference(this.selection.selected, this.items())
      );
    });
  }

  selectItem(item: SelectableItemDirective, SELECTED = true) {
    if (this.disabled() || item.disabled()) return;
    if (SELECTED) {
      if (!this.$$.includes(this.items(), item)) return;
      this.selection.select(item);
    } else {
      this.selection.deselect(item);
    }
  }
}
