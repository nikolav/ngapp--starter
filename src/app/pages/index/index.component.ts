import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { StoreDataCache } from "../../stores";
import { DdemoDirective } from "../../directives";
// import { UseUtilsService } from "../../services";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, DdemoDirective],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [StoreDataCache],
})
export class IndexComponent implements OnInit, OnDestroy {
  // private $$ = inject(UseUtilsService);
  dd = inject(StoreDataCache).use({ foo: 122333 });
  //
  ngOnInit() {}
  ngOnDestroy() {}
}
//
