import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { AppConfigService, UseUtilsService } from "../utils";
import {
  Q_collectionsDocsByTopic,
  M_collectionsDocsUpsert,
  M_collectionsDocsDrop,
} from "../../graphql";
import type {
  IRecordJsonWithMergeFlag,
  IResultCollectionsDocs,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class CollectionsManageService {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $apollo = inject(Apollo);

  // collectionsDocsByTopic(topic: String!, config: JsonData): JsonData!
  topic(topic: string) {
    return topic
      ? this.$apollo.watchQuery<IResultCollectionsDocs>({
          query: Q_collectionsDocsByTopic,
          variables: {
            topic,
            config: null,
          },
          pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
        })
      : undefined;
  }

  // collectionsDocsUpsert(topic: String!, patches: [JsonData!]!): JsonData!
  commit(topic: string, patches: IRecordJsonWithMergeFlag[]) {
    return topic
      ? this.$apollo.mutate({
          mutation: M_collectionsDocsUpsert,
          variables: {
            topic,
            patches,
          },
        })
      : undefined;
  }
  // collectionsDocsDrop(topic: String!, ids: [ID!]!): JsonData!
  rm(topic: string, ids: any[]) {
    return topic
      ? this.$apollo.mutate({
          mutation: M_collectionsDocsDrop,
          variables: { topic, ids },
        })
      : undefined;
  }
  data(result: any) {
    return this.$$.get(result, "data.collectionsDocsByTopic.status");
  }
}
