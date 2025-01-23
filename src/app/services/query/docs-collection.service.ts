import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult } from "@apollo/client/core";
import { Subscription } from "rxjs";
import { Q_collectionsByTopic } from "../../graphql";
import { AppConfigService, UseUtilsService } from "../../services";
import type { TOrNoValue } from "../../types";
import { schemaDocsCollectionsConfig } from "../../schemas";

// interface IResultApolloDocsCollection {
//   collectionsByTopic: {
//     error: any;
//     status: {
//       docs: { _id: string; [name: string]: any }[];
//     };
//   };
// }
interface IDocsCollectionsConfig {
  topic: string;
  fields: string[];
}

@Injectable({
  providedIn: "root",
})
export class DocsCollectionService {
  private $apollo = inject(Apollo);
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  //
  config = signal<TOrNoValue<IDocsCollectionsConfig>>(undefined);
  enabled = computed(
    () => true === schemaDocsCollectionsConfig.safeParse(this.config()).success
  );
  q = computed(() =>
    this.enabled()
      ? this.$apollo.watchQuery({
          query: Q_collectionsByTopic,
          pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
          variables: {
            topic: this.config()!.topic,
            config: { fields: this.config()!.fields },
          },
        })
      : undefined
  );

  result = signal<TOrNoValue<ApolloQueryResult<any>>>(undefined);
  private result_s: TOrNoValue<Subscription>;

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  error = computed(() => {
    const res = this.result();
    return res?.error || this.$$.get(res, "data.collectionsByTopic.error");
  });
  loading = computed(() => this.result()?.loading);
  data = computed(() =>
    this.$$.get(this.result(), "data.collectionsByTopic.status.docs")
  );

  start() {
    this.result_s = this.q()?.valueChanges.subscribe((result) =>
      this.result.set(result)
    );
  }
  stop() {
    this.result_s?.unsubscribe();
  }
  commit() {}
  drop() {}
  async reload() {
    return await this.q()?.refetch();
  }
}
