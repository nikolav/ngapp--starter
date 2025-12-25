import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { mergeMap } from "rxjs/operators";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import {
  FilesStorageS3Service,
  PickFilesService,
  UseUtilsService,
} from "../../services";
import { TUploadFiles } from "../../types";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  private $$ = inject(UseUtilsService);
  readonly $files = inject(FilesStorageS3Service);
  readonly $filePicker = new PickFilesService();

  constructor() {
    this.$files.onProgress.subscribe((event) => {
      console.log({ event });
    });
  }

  ok() {
    // this.$files.rma("upload/").subscribe((res) => {
    //   console.log({ res });
    // });
    // this.$files
    //   .rm(
    //     "upload/605226509_1540722457162612_4180283261000152808_n.jpg",
    //     "upload/G83_U_hboAACO_h.jpg",
    //     "upload/G8sYOzyWgAA9BzL.jpg"
    //   )
    //   .subscribe((res) => {
    //     console.log({ res });
    //   });
    this.$filePicker
      .open({ multiple: true })
      .pipe(
        mergeMap((files) => {
          return this.$files.upload(
            this.$$.reduce(
              files,
              (accum, file) => {
                accum[file.name] = { file };
                return accum;
              },
              <TUploadFiles>{}
            )
          );
        })
      )
      .subscribe((res) => {
        console.log({ res });
      });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
