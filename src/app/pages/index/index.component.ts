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
} from "../../services";
import {
  StoreGlobalVariable,
  StoreAuth,
  StoreAppProcessing,
} from "../../stores";

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
  $config = inject(AppConfigService);
  $env = inject(StoreGlobalVariable);
  $ps = inject(StoreAppProcessing);

  flag1 = signal(true);

  $auth = inject(StoreAuth);
  $lightbox = inject(LightboxService);

  toggleFoo = new UseToggleFlagService();
  $sig = new UseUniqueIdService();

  // $qclientStatus = inject(ApolloStatusService);
  // dd = computed(() => this.$$.dumpJson(this.$qclientStatus.data()));

  G_foo = "foo";

  x1 = "x1";

  constructor() {
    if (!this.$env.exists(this.G_foo)) {
      this.$env.commit(this.G_foo, signal(null));
    }
    this.$ps.watch(this.flag1);
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
  flag1Toggle() {
    this.flag1.update((val) => !val);
  }
}
