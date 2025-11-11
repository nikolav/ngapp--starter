import { inject, Injectable } from "@angular/core";
import { Observable, from, forkJoin } from "rxjs";
import { map as op_map } from "rxjs/operators";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  listAll,
  deleteObject,
  FullMetadata,
} from "firebase/storage";

import { storage as firebaseStorage } from "../../config/firebase";
import { UseProccessMonitorService, UseUtilsService } from "../../services";
import { TUploadFiles } from "../../types";

@Injectable({
  providedIn: "root",
})
export class FilesStorageService {
  private $$ = inject(UseUtilsService);
  private $ps = new UseProccessMonitorService();

  // .upload({ foo1: { file: File{}, path?: 'temp/foo.txt' }, ... })
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
              const refStorageNode = ref(firebaseStorage, pathFilename);
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
        this.$ps.begin();
        try {
          const refs = this.$$.get(
            await listAll(ref(firebaseStorage, path)),
            "items",
            []
          );
          metas = await Promise.all(refs.map(getMetadata));
        } catch (error) {
          this.$ps.setError(error);
        } finally {
          setTimeout(() => {
            this.$ps.done(() => {
              observer.complete();
            });
          });
        }
        if (!this.$ps.error()) {
          this.$ps.successful(() => {
            observer.next(metas);
          });
        }
      })();
    });
  }
  rm(...fullPaths: string[]) {
    return forkJoin(
      fullPaths.map((fullPath) =>
        from(deleteObject(ref(firebaseStorage, fullPath)))
      )
    );
  }
  rma(path: string) {
    return new Observable((observer) => {
      this.ls(path).subscribe((metas) => {
        if (!this.$$.isEmpty(metas)) {
          const lsObs = metas.map((meta) =>
            from(deleteObject(ref(firebaseStorage, meta.ref?.fullPath)))
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
    return from(getDownloadURL(ref(firebaseStorage, pathFilename)));
  }
  info(pathFilename: string) {
    return from(getMetadata(ref(firebaseStorage, pathFilename)));
  }
}
