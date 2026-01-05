import { Directive, effect, input, model, output } from "@angular/core";

import type { IEventApp, TOrNoValue } from "../../types";

export interface ISelectableItemChangeEventPayload {
  selected: boolean;
  target: SelectableItemDirective;
}

@Directive({
  selector: "[appSelectableItem]",
  exportAs: "appSelectableItem",
})
export class SelectableItemDirective {
  static readonly EVENT_CHANGE =
    "EVENT:CHANGE:SelectableItemDirective:83e250b8-d422-57c6-982d-fc2de293ff8b";

  // [(@@)]
  readonly selected = model<boolean>(false, {
    alias: "appSelectableItemSelected",
  });

  // [@@]
  readonly name = input<TOrNoValue<string>>(null, {
    alias: "appSelectableItemName",
  });

  // (@@)
  readonly change = output<IEventApp<ISelectableItemChangeEventPayload>>({
    alias: "appSelectableItemChange",
  });

  constructor() {
    effect(() => {
      this.change.emit({
        type: SelectableItemDirective.EVENT_CHANGE,
        payload: { selected: this.selected(), target: this },
      });
    });
  }
}
