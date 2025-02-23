import { Injectable, inject, signal, computed } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult } from "@apollo/client/core";
import { Subscription } from "rxjs";

import { Q_status } from "../../../graphql";
import { AppConfigService } from "../../../services";
import type { TOrNoValue } from "../../../types";

interface IResultApolloStatusService {
  status: string;
}

@Injectable({
  providedIn: "root",
})
export class ApolloStatusService {
  private $apollo = inject(Apollo);
  private $config = inject(AppConfigService);
  //
  result =
    signal<TOrNoValue<ApolloQueryResult<IResultApolloStatusService>>>(
      undefined
    );
  q = this.$apollo.watchQuery<IResultApolloStatusService>({
    query: Q_status,
    pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
    variables: {},
  });
  q_s: TOrNoValue<Subscription>;

  error = computed(() => this.result()?.error);
  loading = computed(() => this.result()?.loading);
  data = computed(() => this.result()?.data);

  start() {
    this.q_s = this.q.valueChanges.subscribe((qres) => this.result.set(qres));
  }
  destroy() {
    this.q_s?.unsubscribe();
  }
  async reload() {
    return await this.q.refetch();
  }
}
