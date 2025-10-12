import { Component, OnInit, OnDestroy, inject, effect } from "@angular/core";
import { Subscription } from "rxjs";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialUIModule } from "../../modules";
import {
  UseCacheKeyService,
  UseToggleFlagService,
  UseUtilsService,
} from "../../services";
import { TOrNoValue } from "../../types/index";
import { transition, trigger, useAnimation } from "@angular/animations";
import { fade } from "../../assets/animations";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
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
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $cacheFoo = new UseCacheKeyService().use(
    "cache:c17c95eb-7a5d-5737-b1fa-cfe5f2de5737"
  );

  private io_s: TOrNoValue<Subscription>;

  boxIsActive = new UseToggleFlagService();

  constructor() {
    effect((onCleanup) => {
      this.io_s = this.$cacheFoo.io()?.subscribe(() => {
        this.$cacheFoo.reload();
      });
      onCleanup(() => {
        this.io_s?.unsubscribe();
      });
    });
  }

  ok() {
    console.log(this.$cacheFoo.data());
  }
  destroy() {
    this.io_s?.unsubscribe();
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.destroy();
  }
}
//
