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
  ok() {
    this.$mail
      .send("admin@nikolav.rs", "hello:1", "blank", {
        content:
          "<p>Id nulla aute officia incididunt proident mollit eiusmod dolor aliqua eu ad laboris fugiat ex. Reprehenderit ipsum culpa incididunt nulla dolor aute cupidatat et adipisicing ea anim. Laboris cupidatat aute pariatur ullamco cupidatat elit exercitation Lorem duis qui officia. Culpa velit ex eu elit elit amet ex culpa eu eiusmod tempor incididunt. Occaecat magna deserunt eiusmod amet aute nostrud cupidatat ad laboris aliqua esse sint incididunt sit. Reprehenderit tempor incididunt dolor voluptate dolore est qui irure nulla et esse. Sunt deserunt ullamco tempor consectetur occaecat voluptate nulla do pariatur enim elit.</p>",
      })
      .subscribe((res) => {
        console.log({ res });
      });
  }

  ngOnInit() {
    this.$audio.init("demo", { src: ["/sample-track.mp3"] });
  }
  ngOnDestroy() {}
}
