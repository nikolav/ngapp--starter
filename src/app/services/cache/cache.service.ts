import { Injectable, inject } from "@angular/core";
import { map } from "rxjs/operators";
import { Apollo } from "apollo-angular";
import {
  Q_cacheRedisGetCacheByKey,
  M_cacheRedisCommit,
  M_cacheRedisDropPathsAtKey,
} from "../../graphql";
import { AppConfigService, UseUtilsService } from "../../services";
import type {
  TRecordJson,
  IResultApolloCacheService,
  TOrNoValue,
} from "../../types";
import { Observable } from "rxjs";

// #https://the-guild.dev/graphql/apollo-angular/docs/get-started#installation
@Injectable({
  providedIn: "root",
})
export class CacheService {
  static readonly ERR_CACHEKEY_EMPTY =
    "ERR_CACHEKEY_EMPTY:57221b6a-81de-52a0-a95a-3f1f2e212574";

  private $apollo = inject(Apollo);
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);

  key$$(cache_key: any) {
    return new Observable((observer) => {
      if (!cache_key) {
        observer.error(CacheService.ERR_CACHEKEY_EMPTY);
      } else {
        observer.next(this._wq(cache_key));
      }
      observer.complete();
    });
  }

  key(cache_key: any) {
    return cache_key ? this._wq(cache_key) : undefined;
  }

  commit(cache_key: any, patch: TOrNoValue<TRecordJson>, merge = true) {
    return cache_key && (merge ? !this.$$.isEmpty(patch) : patch)
      ? this.$apollo.mutate({
          mutation: M_cacheRedisCommit,
          variables: {
            cache_key,
            patch,
            merge,
          },
        })
      : this.$$.error$$();
  }

  // cacheRedisDropPathsAtKey(cache_key: String!, paths: [String!]!, separator: String): JsonData!
  drop(cache_key: any, paths: string[], separator?: string) {
    return cache_key && !this.$$.isEmpty(paths)
      ? this.$apollo
          .mutate({
            mutation: M_cacheRedisDropPathsAtKey,
            variables: {
              cache_key,
              paths,
              separator,
            },
          })
          .pipe(map((res) => this.$$.get(res, "data.cacheRedisDropPathsAtKey")))
      : this.$$.error$$();
  }

  data(result: any, cache_key: any) {
    return this.$$.get(
      result,
      `data.cacheRedisGetCacheByKey.status.cache["${cache_key}"]`
    );
  }

  private _wq(cache_key: any) {
    return this.$apollo.watchQuery<IResultApolloCacheService>({
      query: Q_cacheRedisGetCacheByKey,
      variables: {
        cache_key,
      },
      pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
    });
  }
}
