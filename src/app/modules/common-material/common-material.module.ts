import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
// import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";

const MODULES = [
  CommonModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatBadgeModule,
  MatGridListModule,
];

@NgModule({
  // declarations: [],
  imports: [...MODULES],
  exports: [...MODULES],
})
export class CommonMaterialModule {}
