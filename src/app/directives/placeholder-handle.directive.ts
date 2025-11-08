import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appPlaceholderHandle]",
  exportAs: "placeholderHandleDirective",
})
export class PlaceholderHandleDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
