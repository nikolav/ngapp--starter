import {
  Directive,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { TOrNoValue } from "../types";

@Directive({
  selector: "[appPageLayout]",
})
export class PageLayoutDirective {
  private refTemplate = inject(TemplateRef);
  private refvc = inject(ViewContainerRef);
  appPageLayout = input<TOrNoValue<string>>();

  constructor() {}
}
