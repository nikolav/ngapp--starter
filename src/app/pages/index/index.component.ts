import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { StoreDataCache, StoreAuth } from "../../stores";
import { UseUtilsService } from "../../services";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, JsonPipe],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [StoreDataCache],
})
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $auth = inject(StoreAuth);
  dd = inject(StoreDataCache).use({
    foo: "fcbb8a08-2df8-5d5f-9234-55748fd41150",
  });
  //
  ngOnInit() {}
  ngOnDestroy() {}
  logDebug() {
    console.log(this.$auth.debug());
  }
}
//
