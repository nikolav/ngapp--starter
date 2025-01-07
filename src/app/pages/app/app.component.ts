import { Component, inject, computed } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IconAccount } from "../../components/icons";
import { StoreGlobalVariable } from "../../stores";

@Component({
  selector: "page-app",
  imports: [IconAccount],
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
