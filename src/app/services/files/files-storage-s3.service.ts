import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Observable, of, from as oFrom, Subject } from "rxjs";
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
import { TOrNoValue, TUploadFiles } from "../../types";

@Injectable({
  providedIn: "root",
})
export class FilesStorageS3Service {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $apollo = inject(Apollo);
  private $http = inject(HttpClient);

  private readonly CONCURRENCY = 10;

  readonly onProgress = new Subject<unknown>();

  // batch push files to s3
  upload(files: TUploadFiles) {
    const prefix = this.$$.trimEnd(
      this.$config.services.aws.AWS_UPLOAD_S3_PREFIX,
      "/"
    );
    return oFrom(this.$$.entries(files)).pipe(
      mergeMap(([key_, { file, path }]) => {
        const key = this.$$.strEnsureHasPrefix(
          this.$$.trim(path ?? key_, "/"),
          `${prefix}/`
        );
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
            mergeMap(
              (dd: any) =>
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
                        HttpEventType.UploadProgress == event.type &&
                        event.total
                      ) {
                        this.onProgress.next({
                          key: dd.key,
                          progress: Math.round(
                            (100 * event.loaded) / event.total
                          ),
                        });
                      }
                    }),
                    opFilter((event) => HttpEventType.Response == event.type),
                    opMap(() => this.$$.res({ [dd.key]: true }, null))
                  ),
              this.CONCURRENCY
            ),
            catchError((error) => of(this.$$.res(null, error)))
          );
      }, this.CONCURRENCY),
      opReduce((accum, res) => {
        if (null != res.error) {
          (<any[]>accum.error).push(res.error);
        } else {
          this.$$.copy(<any>accum.result, res.result);
        }
        return accum;
      }, this.$$.res(<any>{}, <any[]>[])),
      opMap((d) => d.dump())
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
          this.$$.res(
            this.$$.get(res, "data.awsUploadDownloadUrl.status.downloadUrl"),
            null
          )
        ),
        catchError((error) => of(this.$$.res(null, error))),
        opMap((d) => d.dump())
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
        opMap((res) =>
          this.$$.res(
            this.$$.get(res, "data.awsUploadListObjects.status"),
            null
          )
        ),
        catchError((error) => of(this.$$.res(null, error))),
        opMap((res) => res.dump())
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
              opMap((dd: any) =>
                this.$$.res({ [dd.key]: `${dd.code}:${dd.status}` }, null)
              ),
              catchError((error) => of(this.$$.res(null, error)))
            ),
        this.CONCURRENCY
      ),
      opReduce((accum, res) => {
        if (null != res?.error) {
          // accumulate errors
          (<any[]>accum.error).push(res.error);
        } else {
          this.$$.copy(<any>accum.result, res.result);
        }
        return accum;
      }, this.$$.res(<any>{}, <any[]>[])),
      opMap((d) => d.dump())
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
          this.$$.res(
            this.$$.get(res, "data.awsUploadDeleteObjectsAllUnderPrefix"),
            null
          )
        ),
        catchError((error) => of(this.$$.res(null, error))),
        opMap((d) => d.dump())
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
      .pipe(
        opMap((res) =>
          this.$$.res(this.$$.get(res, "data.awsUploadObjectMetadata"), null)
        ),
        catchError((error) => of(this.$$.res(null, error))),
        opMap((d) => d.dump())
      );
  }
}
