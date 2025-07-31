import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { StoreDataCache } from "../../stores";
import { DdemoDirective } from "../../directives";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, DdemoDirective],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [StoreDataCache],
})
export class IndexComponent implements OnInit, OnDestroy {
  dd = inject(StoreDataCache).use({
    foo: "fcbb8a08-2df8-5d5f-9234-55748fd41150",
  });
  //
  ngOnInit() {}
  ngOnDestroy() {}
}
//
