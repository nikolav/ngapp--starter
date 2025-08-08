import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
// import { PopperjsModule } from "../../modules";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule, PopperjsModule } from "../../modules";
import { StoreAuth, StoreMain } from "../../stores";
import {
  UseUtilsService,
  // UseDisplayService,
  UseToggleFlagService,
} from "../../services";
import {
  IconLoading,
  IconAccount,
  IconBuildings,
} from "../../components/icons";

@Component({
  selector: "page-index",
  imports: [
    IconAccount,
    IconBuildings,
    IconLoading,
    JsonPipe,
    LayoutDefault,
    MaterialUIModule,
    PopperjsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  private f = inject(FormBuilder);
  $$ = inject(UseUtilsService);
  $main = inject(StoreMain);
  // $auth = inject(StoreAuth);

  $toggle = new UseToggleFlagService().use(false);

  val = this.f.control("");

  list = ["foo", "bar", "baz"];

  ok() {
    console.log(
      this.$$.deepmerge()(
        { x: { a: [null, { b: 1 }] } },
        { x: { a: [{ c: 2 }] } }
      )
    );
  }
  ngOnInit() {}
  ngOnDestroy() {}

  debug() {
    console.log(this.$main.store());
  }
}
//
