import { ChangeDetectionStrategy, Component } from "@angular/core";

import { CoreModulesShared } from "../../../../modules";

@Component({
  selector: "app-focus-captured",
  imports: [CoreModulesShared],
  templateUrl: "./focus-captured.component.html",
  styleUrl: "./focus-captured.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFocusCapturedComponent {}

// <app-focus-captured>
//   <mat-card>
//     lorem
//   </mat-card>
// </app-focus-captured>
