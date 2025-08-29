import { Component, OnInit, OnDestroy, effect, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
// import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import {
  PickFilesService,
  FilesStorageService,
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
  private $$ = inject(UseUtilsService);
  $files = new PickFilesService();
  $storage = inject(FilesStorageService);

  constructor() {}

  ok() {
    this.$files.open().subscribe((files) => {
      console.log({ files });
    });
  }
  ok2() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
//
