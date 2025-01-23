import { Component, inject, computed } from "@angular/core";

import { StoreGlobalVariable } from "../../stores";
import { IconxModule, CommonMaterialModule } from "../../modules";
import type { ICanComponentDeactivate } from "../../types";

@Component({
  selector: "page-app",
  imports: [CommonMaterialModule, IconxModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements ICanComponentDeactivate {
  private $g = inject(StoreGlobalVariable);

  private G_foo = "foo";

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
