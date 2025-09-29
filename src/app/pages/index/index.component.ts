import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  computed,
  effect,
} from "@angular/core";
import { RouterModule } from "@angular/router";
// import { AsyncPipe } from "@angular/common";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialUIModule } from "../../modules";
import {
  CollectionsService,
  DocsService,
  UseCacheKeyService,
  UseUtilsService,
} from "../../services";
import { StoreAuth } from "../../stores";
import { TOrNoValue } from "../../types/index";
import { Subscription } from "rxjs";

@Component({
  selector: "page-index",
  imports: [
    LayoutDefault,
    MaterialUIModule,
    IconxModule,
    RouterModule,
    // AsyncPipe,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $auth = inject(StoreAuth);
  $docs = new DocsService().use("main");
  $cacheFoo = new UseCacheKeyService().use(
    "cache:c17c95eb-7a5d-5737-b1fa-cfe5f2de5737"
  );

  idToken = computed(() => this.$auth.account()?.getIdToken());

  private io_s: TOrNoValue<Subscription>;
  constructor() {
    effect(() => {
      if (!this.$cacheFoo.enabled()) return;
      this.io_s = this.$cacheFoo.io()?.subscribe(() => {
        this.$cacheFoo.reload();
      });
    });
  }

  ok() {
    console.log(this.$cacheFoo.data());
  }
  ok2() {
    this.$cacheFoo
      .commit({ [`x:${this.$$.idGen()}`]: Math.random() })
      ?.subscribe((res) => {
        console.log({ res });
      });
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
