import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[placeholderHandle]",
  exportAs: "placeholderHandle",
})
export class PlaceholderHandleDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
