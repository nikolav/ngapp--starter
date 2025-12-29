import {
  booleanAttribute,
  contentChildren,
  Directive,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";

import { ManageSubscriptionsService, UseUtilsService } from "../../services";
import { SelectableItemDirective } from "./selectable-item.directive";

@Directive({
  selector: "[appSelectable]",
  exportAs: "appSelectable",
})
export class SelectableHasItemsDirective implements OnDestroy {
  protected $$ = inject(UseUtilsService);
  protected $sbs = new ManageSubscriptionsService();

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
  readonly currentSelection = signal<SelectableItemDirective[]>([]);

  constructor() {
    this.$sbs.push({
      sel: this.selection.changed.subscribe(() => {
        this.currentSelection.set([...this.selection.selected]);
      }),
    });
    // deselect removed items
    effect(() => {
      if (this.$$.isEmpty(this.selection.selected)) return;
      const lsrm = this.$$.difference(this.selection.selected, this.items());
      if (this.$$.isEmpty(lsrm)) return;
      this.selection.deselect(...lsrm);
    });
  }

  toggleItem(item: SelectableItemDirective, SELECTED?: boolean) {
    if (this.disabled() || item.disabled()) return;
    let flag = SELECTED;
    if (null == flag) {
      flag = !item.isSelected();
    }
    if (flag) {
      if (!this.$$.includes(this.items(), item)) return;
      this.selection.select(item);
    } else {
      this.selection.deselect(item);
    }
  }

  destroy() {
    this.$sbs.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
