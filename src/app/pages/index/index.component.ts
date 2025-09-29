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
  $collFoo = new CollectionsService().use(
    "foo:a5070071-a654-5c71-a7ee-34449cd0d630"
  );

  idToken = computed(() => this.$auth.account()?.getIdToken());

  private io_s: TOrNoValue<Subscription>;
  constructor() {
    effect(() => {
      if (!this.$collFoo.enabled()) return;
      this.io_s = this.$collFoo.io()?.subscribe(() => {
        this.$collFoo.reload();
      });
    });
  }

  ok() {
    console.log(this.$collFoo.data());
  }
  ok2() {
    this.$collFoo
      .commit([
        {
          data: {
            data: {
              [`x:${this.$$.idGen()}`]: Math.random(),
            },
          },
        },
      ])
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
