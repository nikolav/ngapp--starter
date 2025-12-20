import { Component, OnInit, OnDestroy } from "@angular/core";
import { JsonPipe } from "@angular/common";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { DocService } from "../../services";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    JsonPipe,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $d = DocService.init("d:QaHsmyoiFWcWZ4Dlt");
  ok() {
    this.$d
      .commit({
        "x:1": Math.random(),
        "x:2": Math.random(),
      })
      .subscribe((res) => {
        console.log({ res });
      });
    // this.$d.drop("x:2").subscribe((res) => console.log({ res }));
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
