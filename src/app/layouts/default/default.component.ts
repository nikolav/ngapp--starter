import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
} from "@angular/core";

import { CoreModulesShared } from "../../modules";
import {
  TOKEN_pageLayoutDefaultData,
  TOKEN_windowDefaultView,
} from "../../keys";
import {
  LocalStorageService,
  UseDisplayService,
  UsePageTitleService,
} from "../../services";
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
  readonly $storage = inject(LocalStorageService);
  readonly $ttl = inject(UsePageTitleService);
  readonly $display = inject(UseDisplayService);
  readonly window = inject(TOKEN_windowDefaultView);
  readonly pageData = inject(TOKEN_pageLayoutDefaultData);

  readonly slot_page = contentChild("slot_page", { read: TemplateRef });

  // @@
  readonly pageTitle = input<TOrNoValue<string>>(null);

  constructor() {
    effect(() => {
      if (null == this.pageTitle()) return;
      this.$ttl.title.set(String(this.pageTitle()));
    });
  }
}
