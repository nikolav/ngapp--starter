import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
// import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import {
  PickFilesService,
  FilesStorageService,
  DocsService,
  UseUtilsService,
} from "../../services";

@Component({
  selector: "page-index",
  imports: [
    IconLoading,
    JsonPipe,
    LayoutDefault,
    MaterialUIModule,
    // ReactiveFormsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $$ = inject(UseUtilsService);
  $docs = new DocsService().use("main");

  constructor() {}

  ok() {
    console.log(this.$docs.data());
  }
  ok2() {
    // this.$docs.drop("upndkyfmsal").subscribe((res) => {
    //   console.log({ res });
    // });
    this.$docs
      .commit({
        // id: "128W5y63cRu5qSQeDqW0",
        name: `x:${this.$$.idGen()}`,
        value: Math.random(),
      })
      .subscribe((res) => {
        console.log({ res });
      });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
//
