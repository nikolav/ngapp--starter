import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { of } from "rxjs";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { CleanupService, DocService, UseUtilsService } from "../../services";

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
  private $$ = inject(UseUtilsService);
  private $cleanup = new CleanupService();
  readonly $d = DocService.init("d:QaHsmyoiFWcWZ4Dlt");

  runCleanup() {
    this.$cleanup.reset();
    this.$cleanup.task(() => {
      console.log(0);
    });
    this.$cleanup.task(async () => {
      // throw "err:1";
      return console.log(1);
    });

    this.$cleanup.run().subscribe((res) => {
      console.log({ res });
    });
  }

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
  ngOnDestroy() {
    this.runCleanup();
  }
}
