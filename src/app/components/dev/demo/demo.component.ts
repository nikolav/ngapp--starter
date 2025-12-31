import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  OnDestroy,
  signal,
  TemplateRef,
} from "@angular/core";
import { interval } from "rxjs";

import { CoreModulesShared } from "../../../modules";
import { ManageSubscriptionsService } from "../../../services";

@Component({
  selector: "app-demo",
  imports: [CoreModulesShared],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent implements OnDestroy {
  protected $sbs = new ManageSubscriptionsService();
  readonly slotHeader = contentChild("slot_header", {
    read: TemplateRef,
  });

  protected counter = signal<number>(-1);

  constructor() {
    this.$sbs.push({
      counter: interval(1000).subscribe((n) => {
        this.counter.set(n);
      }),
    });
  }

  ngOnDestroy(): void {
    this.$sbs.destroy();
  }
}
