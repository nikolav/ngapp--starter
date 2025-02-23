import { inject, Injectable } from "@angular/core";
import { from, map as op_map } from "rxjs";
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  listAll,
  deleteObject,
} from "@angular/fire/storage";

import { TUploadFiles } from "../../types";
import { UseUtilsService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class FilesStorageService {
  private $storage = inject(Storage);
  private $$ = inject(UseUtilsService);

  upload(files: TUploadFiles, onProgress: any = this.$$.noop) {
    return from(
      Promise.all(
        this.$$.map(
          files,
          ({ file, path }, title) =>
            new Promise((resolve, reject) => {
              const pathFilename = [
                // .path(),
                this.$$.trim(path ?? file.name, "/"),
              ]
                .filter(Boolean)
                .join("/");
              const refStorageNode = ref(this.$storage, pathFilename);
              const uploadTask = uploadBytesResumable(refStorageNode, file);
              uploadTask.on(
                "state_changed",
                // @progress
                (snapshot) => {
                  // const progress =
                  //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  onProgress({ [title]: snapshot });
                },
                // @error
                reject,
                // @success
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    if (url) {
                      resolve({ [title]: url });
                      return;
                    }
                    reject(null);
                  });
                }
              );
            })
        )
      )
    ).pipe(op_map((res) => this.$$.assign({}, ...res)));
  }
  async ls(path: string) {
    return [
      ...(this.$$.get(await listAll(ref(this.$storage, path)), "items") || []),
    ];
  }
  async rm(pathFilename: string) {
    return await deleteObject(ref(this.$storage, pathFilename));
  }
  async rma(path: string) {
    return await Promise.all(
      this.$$.map(
        await this.ls(path),
        async (node: any) => await this.rm([path, node.name].join("/"))
      )
    );
  }
  async url(pathFilename: string) {
    return await getDownloadURL(ref(this.$storage, pathFilename));
  }
  async info(pathFilename: string) {
    return await getMetadata(ref(this.$storage, pathFilename));
  }
}
