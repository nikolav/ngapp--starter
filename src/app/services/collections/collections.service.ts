import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from "@angular/core";
import { from } from "rxjs";
import { Socket } from "ngx-socket-io";

import { CollectionsManageService } from "./collections-manage.service";
import {
  ManageSubscriptionsService,
  TopicsService,
  UseUtilsService,
} from "../utils";
import { ICollectionsPatchInput } from "../../types";
import { StoreAuth } from "../../stores";

// #https://the-guild.dev/graphql/apollo-angular/docs/get-started#installation
@Injectable()
export class CollectionsService<TData = any> implements OnDestroy {
  private $io = inject(Socket);

  private $auth = inject(StoreAuth);
  private $client = inject(CollectionsManageService);
  private $topics = inject(TopicsService);
  private $$ = inject(UseUtilsService);
  private $sbs = new ManageSubscriptionsService();

  private topic = signal<string>("");
  private q = computed(() => this.$client.topic(this.topic()));

  readonly enabled = computed(() =>
    Boolean(this.$auth.isAuthApi() && this.topic())
  );
  readonly data = signal<TData[]>([]);
  readonly io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.collectionsIoDocsUpdated(this.topic()))
      : this.$$.error$$()
  );
  // ##
  constructor() {
    effect((cleanup) => {
      if (!this.enabled()) return;
      this.start();
      cleanup(() => {
        this.destroy();
        // clear stale list when topic changes
        this.data.set([]);
      });
    });
  }

  // @@
  commit(patches: ICollectionsPatchInput[]) {
    return this.enabled()
      ? this.$client.commit(this.topic(), patches)
      : this.$$.error$$();
  }

  // @@
  rm(...ids: any[]) {
    return this.enabled()
      ? this.$client.rm(this.topic(), ids)
      : this.$$.error$$();
  }

  // @@
  reload() {
    const q = this.q();
    return from(q ? q.refetch() : Promise.reject());
  }

  // @@
  use(topic: string) {
    this.topic.set(topic);
    return this;
  }

  // @@
  static init<T = any>(topic: string) {
    return new CollectionsService<T>().use(topic);
  }

  protected start() {
    this.$sbs.push({
      data: this.q()?.valueChanges.subscribe((res) =>
        this.data.set(this.$client.data(res))
      ),
    });
  }

  protected destroy() {
    this.$sbs.destroy();
  }

  // ##
  ngOnDestroy() {
    this.destroy();
  }
}
