import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { CoreModulesShared } from "../../modules";

import { StoreAppProcessing, StoreFlags, StoreMain } from "../../stores";
import {
  EmitterService,
  LocalStorageService,
  UseDisplayService,
  UsePageTitleService,
} from "../../services";
import { TOKEN_windowDefaultView } from "../../keys";
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
  readonly document = inject(DOCUMENT);
  readonly window = inject(TOKEN_windowDefaultView);
  readonly $cache = inject(StoreMain);
  readonly $flags = inject(StoreFlags);
  readonly $ps = inject(StoreAppProcessing);
  readonly $emitter = inject(EmitterService);

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
