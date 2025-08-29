import { inject, Injectable } from "@angular/core";
import { forkJoin, from, map as op_map } from "rxjs";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  listAll,
  deleteObject,
  FullMetadata,
} from "firebase/storage";

import { TUploadFiles } from "../../types";
import { UseProccessMonitorService, UseUtilsService } from "../../services";
import { storage as firebaseStorage } from "../../config/firebase";
import { Observable } from "@apollo/client/utilities";

@Injectable({
  providedIn: "root",
})
export class FilesStorageService {
  private $$ = inject(UseUtilsService);
  private $psList = new UseProccessMonitorService();
  private $storage = firebaseStorage;

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
      // merge all results in one map
    ).pipe(op_map((res) => this.$$.assign({}, ...res)));
  }
  ls(path: string) {
    return new Observable<FullMetadata[]>((observer) => {
      let metas: FullMetadata[] = [];
      (async () => {
        this.$psList.begin();
        try {
          const refs = this.$$.get(
            await listAll(ref(this.$storage, path)),
            "items",
            []
          );
          metas = await Promise.all(refs.map(getMetadata));
        } catch (error) {
          this.$psList.setError(error);
        } finally {
          setTimeout(() => {
            this.$psList.done(() => {
              observer.complete();
            });
          });
        }
        if (!this.$psList.error()) {
          this.$psList.successful(() => {
            observer.next(metas);
          });
        }
      })();
    });
  }
  rm(...fullPaths: string[]) {
    return forkJoin(
      fullPaths.map((fullPath) =>
        from(deleteObject(ref(this.$storage, fullPath)))
      )
    );
  }
  rma(path: string) {
    return new Observable((observer) => {
      this.ls(path).subscribe((metas) => {
        if (!this.$$.isEmpty(metas)) {
          const lsObs = metas.map((meta) =>
            from(deleteObject(ref(this.$storage, meta.ref?.fullPath)))
          );
          forkJoin(lsObs).subscribe(observer);
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }
  url(pathFilename: string) {
    return from(getDownloadURL(ref(this.$storage, pathFilename)));
  }
  info(pathFilename: string) {
    return from(getMetadata(ref(this.$storage, pathFilename)));
  }
}
