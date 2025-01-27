import {
  Directive,
  inject,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
} from "@angular/core";

@Directive({
  selector: "[ddemo]",
})
export class DdemoDirective implements AfterViewInit {
  private enabled = true;
  private vcRef = inject(ViewContainerRef);
  private fragment = inject(TemplateRef);
  constructor() {
    if (this.enabled) this.vcRef.createEmbeddedView(this.fragment);
  }
  ngAfterViewInit() {}
}
