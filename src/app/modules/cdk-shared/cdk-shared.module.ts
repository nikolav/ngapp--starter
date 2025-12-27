import { NgModule } from "@angular/core";

import { PortalModule } from "@angular/cdk/portal";
import { OverlayModule } from "@angular/cdk/overlay";
import { TextFieldModule } from "@angular/cdk/text-field";
import { A11yModule } from "@angular/cdk/a11y";

const MODULES = [
  // #Core
  A11yModule,
  // BidiModule,
  // LayoutModule,
  // PlatformModule,

  // #Dynamic UI
  PortalModule,
  OverlayModule,

  // #Interaction
  // DragDropModule,
  // ScrollingModule,

  // #Utilities
  // ObserversModule,
  TextFieldModule,
  // ClipboardModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class CdkModulesShared {}
