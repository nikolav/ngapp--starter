import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[appUnless]",
})
export class UnlessDirective {
  // can inject template and viewContainer where template is placed
  constructor(
    private templateRef: TemplateRef<any>,
    private vc: ViewContainerRef
  ) {}
  // directive sits @<ng-template> and has access to template data
  @Input()
  set appUnless(value: boolean) {
    if (!value) {
      // show view if !value
      this.vc.createEmbeddedView(this.templateRef);
    } else {
      this.vc.clear();
    }
  }
}
