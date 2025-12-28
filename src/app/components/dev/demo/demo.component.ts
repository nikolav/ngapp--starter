import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  TemplateRef,
} from "@angular/core";
import { CoreModulesShared } from "../../../modules";

@Component({
  selector: "app-demo",
  imports: [CoreModulesShared],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly slotHeader = contentChild("slot_header", {
    read: TemplateRef,
  });
  readonly slotData = { foo: 1 };
}
