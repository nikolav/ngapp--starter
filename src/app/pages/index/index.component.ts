import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { StoreAuth, StoreMain } from "../../stores";
import { UseUtilsService } from "../../services";
import { IconLoading } from "../../components/icons";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule, JsonPipe, IconLoading],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $main = inject(StoreMain);
  $auth = inject(StoreAuth);

  ngOnInit() {}
  ngOnDestroy() {}

  storeUpdate() {
    this.$main.push({ "a.b": Math.random(), "x.1.b": Math.random() });
  }
}
//
