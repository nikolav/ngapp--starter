import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialUIModule } from "../../modules";
import { DocsService, UseUtilsService } from "../../services";
import { RouterModule } from "@angular/router";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, IconxModule, RouterModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $docs = new DocsService().use("main");

  constructor() {}

  ok() {
    console.log(this.$docs.data());
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
//
