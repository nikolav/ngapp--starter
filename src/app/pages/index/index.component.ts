import { Component, inject, signal, computed, OnInit } from "@angular/core";
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
  CacheService,
  TopicsService,
} from "../../services";
import { StoreGlobalVariable, StoreAuth } from "../../stores";

@Component({
  selector: "page-index",
  imports: [FormsModule, CommonMaterialModule, IconxModule, PipeUtilsModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [
    // UseToggleFlagService,
    // UseProccessMonitorService,
    // UseUniqueIdService,
  ],
})
export class IndexComponent implements OnInit {
  private $http = inject(HttpClient);

  $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $g = inject(StoreGlobalVariable);

  private $cache = inject(CacheService);
  private $topics = inject(TopicsService);

  $auth = inject(StoreAuth);
  $lightbox = inject(LightboxService);

  toggleFoo = new UseToggleFlagService();
  $sig = new UseUniqueIdService();

  // $qclientStatus = inject(ApolloStatusService);
  // dd = computed(() => this.$$.dumpJson(this.$qclientStatus.data()));

  G_foo = "foo";

  x1 = "x1";

  constructor() {
    if (!this.$g.exists(this.G_foo)) {
      this.$g.commit(this.G_foo, signal(null));
    }
  }

  gfoo = computed(() => this.$g.key(this.G_foo)());

  ok() {
    this.$g.key(this.G_foo).set(this.$$.uuid());
  }
  fetch0() {
    this.$http.get(this.$config.API_URL, {}).subscribe((d) => console.log(d));
  }
  //
  ngOnInit() {
    // this.$qclientStatus.start();
  }
  profilePush(patch: any) {
    return this.$auth
      .profilePatch(patch)
      ?.subscribe(async () => await this.$auth.profileReload());
  }
}
