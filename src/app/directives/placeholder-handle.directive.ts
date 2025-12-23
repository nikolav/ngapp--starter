import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appPlaceholderHandle]",
  exportAs: "appPlaceholderHandle",
})
export class PlaceholderHandleDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
