import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
} from "@angular/core";

import { CoreModulesShared } from "../../modules";
import { TOKEN_pageLayoutDefaultData } from "../../keys";
import { UseDisplayService, UsePageTitleService } from "../../services";
import { TOrNoValue } from "../../types";

@Component({
  selector: "app-layout-default",
  imports: [CoreModulesShared],
  templateUrl: "./default.component.html",
  styleUrl: "./default.component.scss",
  host: {
    class: "layout--default",
  },
})
export class DefaultComponent {
  protected $ttl = inject(UsePageTitleService);
  protected $display = inject(UseDisplayService);

  readonly slot_page = contentChild("slot_page", { read: TemplateRef });
  readonly pageData = inject(TOKEN_pageLayoutDefaultData);

  // @@
  readonly pageTitle = input<TOrNoValue<string>>(null);

  constructor() {
    effect(() => {
      if (null == this.pageTitle()) return;
      this.$ttl.title.set(String(this.pageTitle()));
    });
  }
}
