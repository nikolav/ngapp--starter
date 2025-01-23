import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
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
} from "../../services";
import {
  StoreGlobalVariable,
  StoreAuth,
  StoreAppProcessing,
} from "../../stores";
import { LayoutDefault } from "../../layouts";

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
export class IndexComponent implements OnInit {
  private $http = inject(HttpClient);

  $$ = inject(UseUtilsService);
  $config = inject(AppConfigService);
  $env = inject(StoreGlobalVariable);
  $ps = inject(StoreAppProcessing);

  $auth = inject(StoreAuth);
  $lightbox = inject(LightboxService);

  toggleFoo = new UseToggleFlagService();
  $sig = new UseUniqueIdService();
  flag1 = signal(true);

  $ddFoobars = new DocsCollectionService();

  // $qclientStatus = inject(ApolloStatusService);
  // dd = computed(() => this.$$.dumpJson(this.$qclientStatus.data()));

  G_foo = "foo";

  x1 = "x1";

  constructor() {
    if (!this.$env.exists(this.G_foo)) {
      this.$env.commit(this.G_foo, signal(null));
    }
    this.$ps.watch(this.flag1);
    effect(() => console.log({ "@data": this.$ddFoobars.data() }));
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
    this.$ddFoobars.config.set({ topic: "foobars", fields: ["foo", "bar"] });
  }
  flag1Toggle() {
    this.flag1.update((val) => !val);
  }
}
