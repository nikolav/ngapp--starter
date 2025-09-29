import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from "@angular/core";
import { Socket } from "ngx-socket-io";
import { CollectionsManageService } from "./collections-manage.service";
import { ManageSubscriptionsService, TopicsService } from "../utils";
import { IRecordJsonWithMergeFlag } from "../../types";
import { StoreAuth } from "../../stores";

// #https://the-guild.dev/graphql/apollo-angular/docs/get-started#installation
@Injectable()
export class CollectionsService<TData = any> implements OnDestroy {
  private $client = inject(CollectionsManageService);
  private $subs = new ManageSubscriptionsService();
  private $topics = inject(TopicsService);
  private $io = inject(Socket);
  private $auth = inject(StoreAuth);

  private topic = signal<string>("");
  private q = computed(() => this.$client.topic(this.topic()));

  readonly data = signal<TData[]>([]);
  readonly enabled = computed(
    () => this.$auth.isAuthApi() && Boolean(this.topic())
  );
  readonly io = computed(() =>
    this.enabled()
      ? this.$io.fromEvent(this.$topics.collectionsIoDocsUpdated(this.topic()))
      : undefined
  );
  //##
  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;

      this.start();

      onCleanup(() => {
        this.destroy();
        // clear stale list when topic changes
        this.data.set([]);
      });
    });
  }
  //##
  commit(patches: IRecordJsonWithMergeFlag[]) {
    return this.enabled()
      ? this.$client.commit(this.topic(), patches)
      : undefined;
  }
  rm(...ids: any[]) {
    return this.enabled() ? this.$client.rm(this.topic(), ids) : undefined;
  }
  start() {
    this.$subs.push({
      data: this.q()?.valueChanges.subscribe((res) =>
        this.data.set(this.$client.data(res))
      ),
    });
  }
  async reload() {
    return await this.q()?.refetch();
  }
  destroy() {
    this.$subs.destroy();
  }
  use(topic: string) {
    this.topic.set(topic);
    return this;
  }
  // ##
  ngOnDestroy() {
    this.destroy();
  }
}
