import { NgModule } from "@angular/core";

import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";

// import { CommonModule } from "@angular/common";
// import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// import { MatButtonToggleModule } from "@angular/material/button-toggle";
// import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
// import { MatCheckboxModule } from "@angular/material/checkbox";
// import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
// import { MatPaginatorModule } from "@angular/material/paginator";
// import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { MatRippleModule } from "@angular/material/core";
import { MatSidenavModule } from "@angular/material/sidenav";
// import { MatSlideToggleModule } from "@angular/material/slide-toggle";

const MODULES = [
  // CommonModule,
  // ReactiveFormsModule,
  // FormsModule,
  // MatCheckboxModule,
  // MatChipsModule,
  MatMenuModule,
  // MatPaginatorModule,
  // MatProgressBarModule,
  // MatRippleModule,
  MatSidenavModule,
  // MatSlideToggleModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
];

@NgModule({
  // declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class CommonMaterialModule {}
