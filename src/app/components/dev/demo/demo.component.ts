import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  OnDestroy,
  TemplateRef,
} from "@angular/core";

import { CoreModulesShared } from "../../../modules";

@Component({
  selector: "app-demo",
  imports: [CoreModulesShared],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-container-reset !bg-red-200 block",
  },
})
export class DemoComponent implements OnDestroy {
  readonly slot_demo = contentChild("slot_demo", {
    read: TemplateRef,
    // descendants: false,
  });

  ngOnDestroy() {}
}
