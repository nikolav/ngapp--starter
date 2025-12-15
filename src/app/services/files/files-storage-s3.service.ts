import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Observable, from as oFrom, throwError } from "rxjs";
import { Apollo } from "apollo-angular";
import {
  mergeMap,
  catchError,
  map as opMap,
  tap as opTap,
  filter as opFilter,
  reduce as opReduce,
} from "rxjs/operators";

import {
  M_awsUploadDeleteObject,
  M_awsUploadDeleteObjectsAllUnderPrefix,
  Q_awsUploadDownloadUrl,
  Q_awsUploadListObjects,
  Q_awsUploadObjectMetadata,
  Q_awsUploadPresignedUrl,
} from "../../graphql";
import { AppConfigService, UseUtilsService } from "../utils";
import { TFunctionVoid, TOrNoValue, TUploadFiles } from "../../types";

@Injectable({
  providedIn: "root",
})
export class FilesStorageS3Service {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $apollo = inject(Apollo);
  private $http = inject(HttpClient);

  private readonly CONCURENCY = 10;

  // @@
  constructor() {}

  // batch push files to s3
  upload(files: TUploadFiles, onProgress?: TOrNoValue<TFunctionVoid>) {
    const prefix = this.$$.trimEnd(
      this.$config.services.aws.AWS_UPLOAD_S3_PREFIX,
      "/"
    );
    return oFrom(this.$$.entries(files)).pipe(
      mergeMap(([key_, { file, path }]) => {
        const key = path ? [prefix, this.$$.trim(path, "/")].join("/") : key_;
        return this.$apollo
          .query({
            query: Q_awsUploadPresignedUrl,
            variables: {
              filename: file.name,
              contentType: file.type || "application/octet-stream",
              key,
            },
            fetchPolicy: "network-only",
          })
          .pipe(
            opMap((res) =>
              this.$$.get(res, "data.awsUploadPresignedUrl.status")
            ),
            mergeMap((dd: any) =>
              this.$http
                .put(dd.uploadUrl, file, {
                  headers: new HttpHeaders({
                    "Content-Type": dd.contentType,
                  }),
                  observe: "events",
                  reportProgress: true,
                  responseType: "text",
                })
                .pipe(
                  opTap((event) => {
                    if (
                      onProgress &&
                      HttpEventType.UploadProgress === event.type &&
                      event.total
                    ) {
                      onProgress({
                        key: dd.key,
                        progress: Math.round(
                          (100 * event.loaded) / event.total
                        ),
                      });
                    }
                  }),
                  opFilter((event) => HttpEventType.Response === event.type),
                  opMap(() => ({ [dd.key]: true }))
                )
            ),
            catchError((error) => throwError(() => ({ key, error })))
          );
      }, this.CONCURENCY),
      opReduce(
        (acc, curr) => this.$$.assign(acc, curr),
        <Record<string, boolean>>{}
      )
    );
  }

  // get temporary object preview url
  url(key: string, forceDownload = false) {
    return this.$apollo
      .query({
        query: Q_awsUploadDownloadUrl,
        variables: {
          key,
          forceDownload,
        },
        // fetchPolicy: "network-only",
      })
      .pipe(
        opMap((res) =>
          this.$$.get(res, "data.awsUploadDownloadUrl.status.downloadUrl")
        )
      );
  }

  // list object under a prefix
  ls(prefix: string) {
    return this.$apollo
      .query({
        query: Q_awsUploadListObjects,
        variables: {
          prefix,
        },
        fetchPolicy: "network-only",
      })
      .pipe(
        opMap((res) => this.$$.get(res, "data.awsUploadListObjects.status"))
      );
  }

  // remove objects @keys
  rm(...keys: string[]) {
    return oFrom(keys).pipe(
      mergeMap(
        (key) =>
          this.$apollo
            .mutate({
              mutation: M_awsUploadDeleteObject,
              variables: { key },
              fetchPolicy: "network-only",
            })
            .pipe(
              opMap((res) =>
                this.$$.get(res, "data.awsUploadDeleteObject.status")
              ),
              opMap((dd: any) => ({ [dd.key]: `${dd.code}:${dd.status}` }))
            ),
        this.CONCURENCY
      ),
      opReduce(
        (acc, curr) => this.$$.assign(acc, curr),
        <Record<string, string>>{}
      )
    );
  }

  // remove all keys under prefix
  rma(prefix: TOrNoValue<string> = null) {
    return this.$apollo
      .mutate({
        mutation: M_awsUploadDeleteObjectsAllUnderPrefix,
        variables: {
          prefix,
        },
        fetchPolicy: "network-only",
      })
      .pipe(
        opMap((res) =>
          this.$$.get(res, "data.awsUploadDeleteObjectsAllUnderPrefix")
        )
      );
  }

  // get metadata info for object
  info(key: string) {
    return this.$apollo
      .query({
        query: Q_awsUploadObjectMetadata,
        variables: {
          key,
        },
        // fetchPolicy: "network-only",
      })
      .pipe(opMap((res) => this.$$.get(res, "data.awsUploadObjectMetadata")));
  }
}
