import { Component, OnInit, OnDestroy, effect } from "@angular/core";
import { Subscription } from "rxjs";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialUIModule } from "../../modules";
import { UseCacheKeyService } from "../../services";
import { TOrNoValue } from "../../types/index";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  $cacheFoo = new UseCacheKeyService().use(
    "cache:c17c95eb-7a5d-5737-b1fa-cfe5f2de5737"
  );

  private io_s: TOrNoValue<Subscription>;

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
