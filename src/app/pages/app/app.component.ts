import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

import { IconAccount, IconBuildings } from "../../components/icons";
import { StoreGlobalVariable } from "../../stores";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "page-app",
  imports: [
    CommonModule,
    MatIconModule,
    IconAccount,
    IconBuildings,
    MatButtonModule,
  ],
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
