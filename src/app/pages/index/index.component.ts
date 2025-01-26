import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
  OnDestroy,
  // Injector,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import {
  CommonMaterialModule,
  IconxModule,
  PipeUtilsModule,
} from "../../modules";

import {
  UseUtilsService,
  UseToggleFlagService,
  AppConfigService,
  // UseProccessMonitorService,
  UseUniqueIdService,
  // ApolloStatusService,
  LightboxService,
  DocsCollectionService,
  // DatetimeService,
} from "../../services";
import {
  StoreGlobalVariable,
  StoreAuth,
  // StoreAppProcessing,
} from "../../stores";
import { LayoutDefault } from "../../layouts";
// import { TOrNoValue } from "../../types";
// import { Subscription } from "rxjs";

@Component({
  selector: "page-index",
  imports: [
    // components
    LayoutDefault,
    // services
    FormsModule,
    CommonMaterialModule,
    IconxModule,
    PipeUtilsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [
    // UseToggleFlagService,
    // UseProccessMonitorService,
    // UseUniqueIdService,
    // DocsCollectionService,
  ],
})
export class IndexComponent implements OnInit, OnDestroy {
  // private $injector = inject(Injector);
  $http = inject(HttpClient);
  $$ = inject(UseUtilsService);
  $config = inject(AppConfigService);
  $env = inject(StoreGlobalVariable);
  $auth = inject(StoreAuth);
  $lightbox = inject(LightboxService);

  $ddLogs = new DocsCollectionService().use(this.$config.collections.logs);

  $sig = new UseUniqueIdService();
  toggleFoo = new UseToggleFlagService().use(true);

  // $qclientStatus = inject(ApolloStatusService);
  // dd = computed(() => this.$$.dumpJson(this.$qclientStatus.data()));

  G_foo = "foo";

  x1 = "x1";

  constructor() {
    if (!this.$env.exists(this.G_foo)) {
      this.$env.commit(this.G_foo, signal(null));
    }
    // let logs_s: TOrNoValue<Subscription>;
    // effect(() => {
    //   if (this.$ddLogs.enabled()) {
    //     logs_s = this.$ddLogs.IO()!.subscribe(() => this.$ddLogs.reload());
    //   } else {
    //     logs_s?.unsubscribe();
    //   }
    // });
    effect(() => console.log({ "@logs": this.$ddLogs.data() }));
  }

  gfoo = computed(() => this.$env.key(this.G_foo)());

  ok() {
    this.$env.key(this.G_foo).set(this.$$.uuid());
  }
  fetch0() {
    this.$http.get(this.$config.API_URL, {}).subscribe((d) => console.log(d));
  }
  //
  ngOnInit() {
    // this.$qclientStatus.start();
  }
  ngOnDestroy() {
    // this.$ddFoobars.stop();
  }
  logsReload() {
    this.$ddLogs.reload();
  }
  logsAdd() {
    return this.$ddLogs
      .commit({
        message: `message --${this.$$.idGen()}`,
      })
      ?.subscribe();
  }
}
