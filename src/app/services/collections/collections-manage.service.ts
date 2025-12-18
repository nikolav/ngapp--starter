import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

import {
  Q_collectionsDocsByTopic,
  M_collectionsDocsUpsert,
  M_collectionsDocsDrop,
} from "../../graphql";
import { AppConfigService, UseUtilsService } from "../utils";
import type {
  ICollectionsPatchInput,
  IResultCollectionsDocs,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class CollectionsManageService {
  private $apollo = inject(Apollo);
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);

  // collectionsDocsByTopic(topic: String!, config: JsonData): JsonData!
  topic(topic: string, config?: any) {
    return topic ? this._wq(topic, config) : undefined;
  }

  // collectionsDocsUpsert(topic: String!, patches: [JsonData!]!): JsonData!
  commit(topic: string, patches: ICollectionsPatchInput[]) {
    return topic && !this.$$.isEmpty(patches)
      ? this.$apollo.mutate({
          mutation: M_collectionsDocsUpsert,
          variables: {
            topic,
            patches,
          },
        })
      : this.$$.error$$();
  }

  // collectionsDocsDrop(topic: String!, ids: [ID!]!): JsonData!
  rm(topic: string, ids: any[]) {
    return topic && !this.$$.isEmpty(ids)
      ? this.$apollo.mutate({
          mutation: M_collectionsDocsDrop,
          variables: { topic, ids },
        })
      : this.$$.error$$();
  }

  data(result: any) {
    return this.$$.get(result, "data.collectionsDocsByTopic.status");
  }

  //
  private _wq(topic: string, config: any) {
    return this.$apollo.watchQuery<IResultCollectionsDocs>({
      query: Q_collectionsDocsByTopic,
      variables: {
        topic,
        config,
      },
      pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
    });
  }
}
