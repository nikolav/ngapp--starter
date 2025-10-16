import {
  Injectable,
  inject,
  signal,
  computed,
  OnDestroy,
  effect,
} from "@angular/core";
import { Apollo } from "apollo-angular";

import { Q_status } from "../../../graphql";
import { ManageSubscriptionsService, UseUtilsService } from "../../../services";
import { StoreAuth } from "../../../stores";

@Injectable({
  providedIn: "root",
})
export class ApolloStatusService implements OnDestroy {
  protected $$ = inject(UseUtilsService);
  protected $apollo = inject(Apollo);
  protected $auth = inject(StoreAuth);
  protected $subs = new ManageSubscriptionsService();

  protected q = this.$apollo.watchQuery({
    query: Q_status,
  });
  readonly enabled = computed(() => this.$auth.isAuthApi());
  readonly data = signal<any>(undefined);

  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      this.start();
      onCleanup(() => {
        this.destroy();
        this.data.set(undefined);
      });
    });
  }
  start() {
    this.$subs.push({
      data: this.q.valueChanges.subscribe((res) => {
        this.data.set(this.$$.get(res, "data.status"));
      }),
    });
  }
  reload() {
    return this.q.refetch();
  }
  destroy() {
    this.$subs.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
