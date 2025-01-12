import { Component, inject, computed } from "@angular/core";
import { ActivatedRoute, GuardResult, MaybeAsync } from "@angular/router";

import { CommonMaterialModule } from "../../modules";

import { StoreGlobalVariable } from "../../stores";
import { IconAccount, IconBuildings } from "../../components/icons";

import type { ICanComponentDeactivate } from "../../types";

@Component({
  selector: "page-app",
  imports: [CommonMaterialModule, IconAccount, IconBuildings],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  private $g: StoreGlobalVariable = inject(StoreGlobalVariable);
  route: ActivatedRoute = inject(ActivatedRoute);

  G_foo = "foo";

  gfoo = computed(() => {
    try {
      return this.$g.key(this.G_foo)();
    } catch (error) {
      // pass
    }
  });
  canDeactivate() {
    return true;
  }
}
