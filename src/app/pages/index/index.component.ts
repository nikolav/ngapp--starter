import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
// import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import {
  PickFilesService,
  FilesStorageService,
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
  $files = new PickFilesService();
  $storage = inject(FilesStorageService);

  constructor() {}

  ok() {
    this.$storage.ls("/temp").subscribe((ls) => {
      console.log({ ls });
    });
  }
  ok2() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
//
