import { Component, inject, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { CommonMaterialModule } from "../../modules";

import {
  UseUtilsService,
  UseToggleFlagService,
  AppConfigService,
  UseProccessMonitorService,
  UseUniqueIdService,
} from "../../services";
import { StoreGlobalVariable } from "../../stores";

@Component({
  selector: "page-index",
  imports: [FormsModule, CommonMaterialModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [
    UseToggleFlagService,
    UseProccessMonitorService,
    UseUniqueIdService,
  ],
})
export class IndexComponent {
  private $http = inject(HttpClient);
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $g = inject(StoreGlobalVariable);
  private $ps = inject(UseProccessMonitorService);
  toggleFoo = inject(UseToggleFlagService);
  $sig = inject(UseUniqueIdService);

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
}
