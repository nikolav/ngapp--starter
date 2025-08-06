import { Component, OnInit, OnDestroy, inject, viewChild } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { StoreAuth, StoreMain } from "../../stores";
import { UseUtilsService } from "../../services";
import { IconLoading, IconAccount } from "../../components/icons";
import { IconBuildingsComponent } from "../../components/icons/icon-buildings/icon-buildings.component";

@Component({
  selector: "page-index",
  imports: [
    LayoutDefault,
    MaterialUIModule,
    JsonPipe,
    IconLoading,
    ReactiveFormsModule,
    IconAccount,
    IconBuildingsComponent,
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

  fieldText = this.f.control("");

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
    this.fieldText.valueChanges.subscribe((val) => {
      console.log({ val });
    });
  }
  ngOnDestroy() {}

  fieldTextClear() {
    this.fieldText.reset();
  }

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
