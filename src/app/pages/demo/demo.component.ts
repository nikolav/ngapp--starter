import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { fade } from "../../assets/animations";
import { UseToggleFlagService } from "../../services";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, MaterialUIModule, RouterModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
  animations: [
    trigger("show", [
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

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
