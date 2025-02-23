import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { CommonMaterialModule } from "../../modules";
import { StoreDataCache } from "../../stores";
import { DdemoDirective } from "../../directives";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, CommonMaterialModule, DdemoDirective],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [StoreDataCache],
})
export class IndexComponent implements OnInit, OnDestroy {
  dd = inject(StoreDataCache).use({ foo: 122 });
  //
  ngOnInit() {}
  ngOnDestroy() {}
}
//
