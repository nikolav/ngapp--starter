import { Component, OnInit, OnDestroy } from "@angular/core";
import { JsonPipe } from "@angular/common";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";
import { DocService } from "../../services";
@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialSharedModule, IconxModule, JsonPipe],
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
