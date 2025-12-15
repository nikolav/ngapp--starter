import { Component, OnInit, OnDestroy, inject } from "@angular/core";
// import { from as oFrom } from "rxjs";
// import { mergeMap, map as opMap } from "rxjs/operators";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";
import {
  FilesStorageS3Service,
  // PickFilesService,
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

  // pickFiles = new PickFilesService();

  ok() {
    this.$files.ls("upload/").subscribe((res) => {
      console.log({ res });
    });
    // this.pickFiles
    //   .open({ multiple: true })
    //   .pipe(
    //     mergeMap((files) => {
    //       return this.$files.upload(
    //         this.$$.reduce(
    //           files,
    //           (acc, file) => {
    //             acc[`upload/${file.name}`] = { file };
    //             return acc;
    //           },
    //           <any>{}
    //         )
    //       );
    //     })
    //   )
    //   .subscribe((res) => {
    //     console.log({ res });
    //   });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
