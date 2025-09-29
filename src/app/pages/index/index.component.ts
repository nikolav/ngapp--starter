import { Component, OnInit, OnDestroy, inject, computed } from "@angular/core";
import { RouterModule } from "@angular/router";
// import { AsyncPipe } from "@angular/common";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialUIModule } from "../../modules";
import { DocsService, UseUtilsService } from "../../services";
import { StoreAuth } from "../../stores";

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

  idToken = computed(() => this.$auth.account()?.getIdToken());

  constructor() {}

  ok() {
    console.log(this.$docs.data());
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
//
