import { computed, Directive, ElementRef, inject } from "@angular/core";

@Directive({
  selector: "[hostElement]",
  exportAs: "hostElement",
})
export class HostElementDirective {
  private hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly element = computed(() => this.hostRef.nativeElement);
}
