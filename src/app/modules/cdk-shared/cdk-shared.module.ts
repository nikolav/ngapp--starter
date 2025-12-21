import { NgModule } from "@angular/core";

// import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from "@angular/cdk/portal";
import { OverlayModule } from "@angular/cdk/overlay";
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { ClipboardModule } from '@angular/cdk/clipboard';
// import { A11yModule } from '@angular/cdk/a11y';
// import { SelectionModel } from '@angular/cdk/collections';

const MODULES = [PortalModule, OverlayModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class CdkModulesShared {}
