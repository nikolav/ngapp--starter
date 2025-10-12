import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { transition, trigger, useAnimation } from "@angular/animations";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { fade } from "../../assets/animations";
import {
  UseMailService,
  UseToggleFlagService,
  AudioService,
} from "../../services";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, MaterialUIModule, RouterModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
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
  $mail = inject(UseMailService);
  boxIsActive = new UseToggleFlagService();
  readonly $audio = inject(AudioService);
  constructor() {
    this.$audio.init("demo", { src: ["/sample-track.mp3"] });
  }
  ok() {
    this.$mail
      .send("admin@nikolav.rs", "hello:1", "blank", {
        content: "foo:1",
      })
      .subscribe((res) => {
        console.log({ res });
      });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
