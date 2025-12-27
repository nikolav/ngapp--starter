import { NgModule } from "@angular/core";

import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PortalModule } from "@angular/cdk/portal";
import { OverlayModule } from "@angular/cdk/overlay";

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  NgOptimizedImage,
  // cdk
  PortalModule,
  OverlayModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class CoreModulesShared {}
