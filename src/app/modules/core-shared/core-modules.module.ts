import { NgModule } from "@angular/core";

import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  NgOptimizedImage,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class CoreModulesShared {}
