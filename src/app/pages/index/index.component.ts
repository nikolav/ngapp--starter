import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";
import {
  FilesStorageS3Service,
  // UseUtilsService,
} from "../../services";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialSharedModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  // private $$ = inject(UseUtilsService);
  private $files = inject(FilesStorageS3Service);

  ok() {
    this.$files.ls("upload/").subscribe((res) => {
      console.log({ res });
    });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
