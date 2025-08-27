import {
  Injectable,
  inject,
  signal,
  computed,
  OnDestroy,
  effect,
} from "@angular/core";
import { Apollo } from "apollo-angular";
import { type ApolloQueryResult } from "@apollo/client/core";

import { Q_status } from "../../../graphql";
import {
  AppConfigService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../../../services";
import type { TOrNoValue } from "../../../types";

@Injectable({
  providedIn: "root",
})
export class ApolloStatusService implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $subs = new ManageSubscriptionsService();
  private $apollo = inject(Apollo);
  //
  private q = computed(() =>
    this.enabled()
      ? this.$apollo.watchQuery({
          query: Q_status,
          pollInterval: this.$config.graphql.QUERY_POLL_INTERVAL,
          variables: {},
        })
      : undefined
  );

  // status: JsonData
  readonly result = signal<TOrNoValue<ApolloQueryResult<any>>>(undefined);
  readonly enabled = signal(true);
  readonly error = computed(() => this.result()?.error);
  readonly loading = computed(() => this.result()?.loading ?? false);
  readonly data = computed(() => this.$$.get(this.result(), "data.status", {}));

  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      this.start();
      onCleanup(() => {
        this.destroy();
        this.result.set(undefined);
      });
    });
  }

  start() {
    this.$subs.push({
      _s1: this.q()?.valueChanges.subscribe((res) => this.result.set(res)),
    });
  }
  destroy() {
    this.$subs.destroy();
  }
  async reload() {
    return await this.q()?.refetch();
  }
  ngOnDestroy() {
    this.$subs.destroy();
  }
}
