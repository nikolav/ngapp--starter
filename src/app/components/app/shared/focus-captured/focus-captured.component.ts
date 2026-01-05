import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from "@angular/core";

import { CoreModulesShared } from "../../../../modules";

@Component({
  selector: "app-focus-captured",
  imports: [CoreModulesShared],
  templateUrl: "./focus-captured.component.html",
  styleUrl: "./focus-captured.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-popup-container app-popup-container--animated app-popup-panel",
    "[class.!bg-red-500]": "debugContainer()",
  },
})
export class AppFocusCapturedComponent {
  debugContainer = input(false, { transform: booleanAttribute });
  // <app-focus-captured>
  //   <mat-card>
  //     lorem
  //   </mat-card>
  // </app-focus-captured>
}
