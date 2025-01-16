import { Injectable, inject } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Q_cacheRedisGetCacheByKey, M_cacheRedisCommit } from "../../graphql";
import { AppConfigService, UseUtilsService } from "../../services";
import type {
  TOrNoValue,
  TRecordJson,
  IResultApolloCacheService,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  private $apollo = inject(Apollo);
  private $config = inject(AppConfigService);
  private $$ = inject(UseUtilsService);

  key(cache_key: any) {
    return cache_key
      ? this.$apollo.watchQuery<IResultApolloCacheService>({
          query: Q_cacheRedisGetCacheByKey,
          pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
          variables: {
            cache_key,
          },
        })
      : undefined;
  }

  commit(cache_key: any, patch: TOrNoValue<TRecordJson>, merge = true) {
    return cache_key
      ? this.$apollo.mutate({
          mutation: M_cacheRedisCommit,
          variables: {
            cache_key,
            patch,
            merge,
          },
        })
      : undefined;
  }

  data(result: any, cache_key: any) {
    return this.$$.get(
      result,
      `data.cacheRedisGetCacheByKey.status.cache["${cache_key}"]`
    );
  }
}
