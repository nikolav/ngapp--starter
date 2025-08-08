import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { PopperjsModule } from "../../modules";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule, PopperjsModule } from "../../modules";
import { StoreAuth, StoreMain } from "../../stores";
import {
  UseUtilsService,
  UseDisplayService,
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
    LayoutDefault,
    MaterialUIModule,
    JsonPipe,
    IconLoading,
    ReactiveFormsModule,
    IconAccount,
    IconBuildings,
    PopperjsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  private f = inject(FormBuilder);
  $$ = inject(UseUtilsService);
  $main = inject(StoreMain);
  $auth = inject(StoreAuth);
  $display = inject(UseDisplayService);

  $toggle = new UseToggleFlagService().use(false);

  val = this.f.control("");

  list = ["foo", "bar", "baz"];

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  ok() {
    console.log(
      this.$$.deepmerge()(
        { x: { a: [null, { b: 1 }] } },
        { x: { a: [{ c: 2 }] } }
      )
    );
  }
  ngOnInit() {
    this.val.valueChanges.subscribe((val) => {
      console.log({ val });
    });
  }
  ngOnDestroy() {}

  fieldTextClear() {}

  patchMain() {
    this.$main.push({
      "x.1": Math.random(),
      "a.b.c": Date.now(),
    });
  }
  debug() {
    console.log(this.$main.store());
  }
}
//
