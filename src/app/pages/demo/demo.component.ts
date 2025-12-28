import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";

import { LayoutDefault } from "../../layouts";
import { MaterialSharedModule } from "../../modules";
import { fade } from "../../assets/animations";
import { UseToggleFlagService } from "../../services";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, MaterialSharedModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("showHide", [
      transition(
        ":enter",
        useAnimation(fade, {
          params: {
            opacityFrom: 0,
            opacityTo: 1,
            scaleFrom: 0.88,
            scaleTo: 1,
            duration: ".24s",
            easing: "ease-out",
          },
        })
      ),
      transition(
        ":leave",
        useAnimation(fade, {
          params: {
            opacityFrom: 1,
            opacityTo: 0,
            scaleFrom: 1,
            scaleTo: 0.88,
            duration: ".12s",
            easing: "ease-out",
          },
        })
      ),
    ]),
  ],
})
export class DemoComponent implements OnDestroy, OnInit {
  boxIsActive = new UseToggleFlagService();

  ngOnInit() {}
  ngOnDestroy() {}
}
