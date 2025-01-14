import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { CommonMaterialModule, IconxModule } from "../../modules";

import {
  UseUtilsService,
  UseToggleFlagService,
  AppConfigService,
  UseProccessMonitorService,
  UseUniqueIdService,

  //
  // ApolloStatusService,
  LightboxService,
} from "../../services";
import { StoreGlobalVariable } from "../../stores";

@Component({
  selector: "page-index",
  imports: [FormsModule, CommonMaterialModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [
    UseToggleFlagService,
    UseProccessMonitorService,
    UseUniqueIdService,
  ],
})
export class IndexComponent implements OnInit {
  private $http = inject(HttpClient);

  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $g = inject(StoreGlobalVariable);
  private $ps = inject(UseProccessMonitorService);

  $lightbox = inject(LightboxService);

  toggleFoo = inject(UseToggleFlagService);
  $sig = inject(UseUniqueIdService);

  // $qclientStatus = inject(ApolloStatusService);
  // dd = computed(() => this.$$.dumpJson(this.$qclientStatus.data()));

  G_foo = "foo";

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
  ngOnInit(): void {
    // this.$qclientStatus.start();
  }
}
