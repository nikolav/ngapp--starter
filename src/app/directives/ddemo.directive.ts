import {
  Directive,
  inject,
  TemplateRef,
  AfterViewInit,
  ViewChild,
  viewChild,
  ElementRef,
  ViewContainerRef,
} from "@angular/core";
import { TOrNoValue } from "../types";
import { UseUtilsService } from "../services";

@Directive({
  selector: "[ddemo]",
})
export class DdemoDirective implements AfterViewInit {
  $$ = inject(UseUtilsService);
  private vcRef = inject(ViewContainerRef);
  private fragment = inject(TemplateRef);
  constructor() {
    this.vcRef.createEmbeddedView(this.fragment);
  }
  ngAfterViewInit() {}
}
