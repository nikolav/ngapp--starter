import { Component, contentChild, TemplateRef } from "@angular/core";

import { CoreModulesShared } from "../../modules";

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
  readonly pageData = <any>{};
}
