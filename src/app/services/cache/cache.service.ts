import { Injectable, inject } from "@angular/core";
import { map } from "rxjs/operators";
import { Apollo } from "apollo-angular";
import {
  Q_cacheRedisGetCacheByKey,
  M_cacheRedisCommit,
  M_cacheRedisDropPathsAtKey,
} from "../../graphql";
import { UseUtilsService } from "../../services";
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
  readonly ERR_CACHEKEY_EMPTY = "@err:d0c2a135-aaff-5f1f-be19-0a9057991135";

  private $apollo = inject(Apollo);
  private $$ = inject(UseUtilsService);

  key$$(cache_key: any) {
    return new Observable((observer) => {
      if (!cache_key) {
        observer.error(this.ERR_CACHEKEY_EMPTY);
      } else {
        observer.next(
          this.$apollo.watchQuery<IResultApolloCacheService>({
            query: Q_cacheRedisGetCacheByKey,
            variables: { cache_key },
          })
        );
      }
      observer.complete();
    });
  }

  key(cache_key: any) {
    return cache_key
      ? this.$apollo.watchQuery<IResultApolloCacheService>({
          query: Q_cacheRedisGetCacheByKey,
          variables: {
            cache_key,
          },
        })
      : undefined;
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
            fetchPolicy: "network-only",
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
}
