import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appPlaceholderHandle]",
})
export class PlaceholderHandleDirective {
  public readonly viewContainerRef = inject(ViewContainerRef);
}
