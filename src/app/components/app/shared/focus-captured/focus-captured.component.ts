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
    class: "w-full m-0 p-0",
    "[class.!bg-lime-200]": "debugContainer()",
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
