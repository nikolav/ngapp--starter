import { Injectable, inject, signal, computed, effect } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult } from "@apollo/client/core";
import { Subscription } from "rxjs";
import {
  Q_collectionsByTopic,
  M_collectionsUpsert,
  M_collectionsDrop,
} from "../../graphql";
import {
  AppConfigService,
  UseUtilsService,
  TopicsService,
} from "../../services";
import type { TOrNoValue } from "../../types";
import { schemaDocsCollectionsConfig } from "../../schemas";
import { take as op_take } from "rxjs/operators";
import { Socket } from "ngx-socket-io";

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
  sort?: string;
}

@Injectable()
export class DocsCollectionService {
  private $apollo = inject(Apollo);
  private $io = inject(Socket);
  //
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $topics = inject(TopicsService);
  //
  config = signal<TOrNoValue<IDocsCollectionsConfig>>(undefined);
  enabled = computed(
    () => schemaDocsCollectionsConfig.safeParse(this.config()).success
  );
  q = computed(() =>
    this.enabled()
      ? this.$apollo.watchQuery({
          query: Q_collectionsByTopic,
          pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
          variables: {
            topic: this.config()!.topic,
            config: {
              fields: this.config()!.fields,
              sort: this.config()?.sort,
            },
          },
        })
      : undefined
  );

  result = signal<TOrNoValue<ApolloQueryResult<any>>>(undefined);
  private result_s: TOrNoValue<Subscription>;

  // io$ --changes-io
  io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(
          this.$topics.collectionsIoEventChanges(this.config()!.topic)
        )
      : undefined
  );

  error = computed(() => {
    const res = this.result();
    return res?.error || this.$$.get(res, "data.collectionsByTopic.error");
  });
  loading = computed(() => this.result()?.loading);
  data = computed(() =>
    this.$$.get(this.result(), "data.collectionsByTopic.status.docs")
  );

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.start();
      } else {
        this.destroy();
      }
    });
  }

  use(config: IDocsCollectionsConfig) {
    this.config.set(config);
    return this;
  }
  start() {
    this.result_s = this.q()?.valueChanges.subscribe((qres) =>
      this.result.set(qres)
    );
  }
  destroy() {
    this.result_s?.unsubscribe();
  }
  commit(data: any, id?: any) {
    return this.enabled()
      ? this.$apollo
          .mutate({
            mutation: M_collectionsUpsert,
            variables: {
              topic: this.config()!.topic,
              data,
              fields: this.config()!.fields,
              id,
            },
          })
          .pipe(op_take(1))
      : undefined;
  }
  drop(...ids: any[]) {
    return this.enabled()
      ? this.$apollo
          .mutate({
            mutation: M_collectionsDrop,
            variables: { topic: this.config()!.topic, ids },
          })
          .pipe(op_take(1))
      : undefined;
  }
  async reload() {
    return await this.q()?.refetch();
  }
}
