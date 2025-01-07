import { Component, inject, signal, computed } from "@angular/core";
import { UseUtilsService, ToggleFlagService } from "../../services";
import { StoreGlobalVariable } from "../../stores";

@Component({
  selector: "page-index",
  imports: [],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [ToggleFlagService],
})
export class IndexComponent {
  private $$: UseUtilsService = inject(UseUtilsService);
  private $g: StoreGlobalVariable = inject(StoreGlobalVariable);

  toggleFoo: ToggleFlagService = inject(ToggleFlagService);

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
}
