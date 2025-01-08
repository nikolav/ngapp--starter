import { Component, inject, computed } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { CommonMaterialModule } from "../../modules";

import { StoreGlobalVariable } from "../../stores";
import { IconAccount, IconBuildings } from "../../components/icons";

@Component({
  selector: "page-app",
  imports: [CommonMaterialModule, IconAccount, IconBuildings],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
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
}
