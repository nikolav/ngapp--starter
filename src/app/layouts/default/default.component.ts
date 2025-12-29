import { Component, contentChild, inject, TemplateRef } from "@angular/core";

import { CoreModulesShared } from "../../modules";
import { TOKEN_pageLayoutDefaultData } from "../../keys";

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
  readonly slot_page = contentChild("slot_page", { read: TemplateRef });
  readonly pageData = inject(TOKEN_pageLayoutDefaultData);
}
