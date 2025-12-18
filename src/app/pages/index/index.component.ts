import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";
import { DocsService, UseUtilsService } from "../../services";
import { JsonPipe } from "@angular/common";
@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialSharedModule, IconxModule, JsonPipe],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  private $$ = inject(UseUtilsService);
  readonly $dd = DocsService.init("main:2");
  ok() {
    this.$dd
      .commit([
        {
          data: {
            name: `x:${this.$$.idGen()}`,
            value: Math.random(),
          },
        },
      ])
      .subscribe((res) => {
        console.log({ res });
      });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
