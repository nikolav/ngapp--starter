import { inject, Injectable } from "@angular/core";

import { UseUtilsService } from "./use-utils.service";
import { TOKEN_windowDefaultView } from "../../keys";

@Injectable({
  providedIn: "root",
})
export class NavUtilsService {
  protected $$ = inject(UseUtilsService);
  protected window = inject(TOKEN_windowDefaultView);

  hardReload(path = "") {
    const url = new URL(this.window!.location.origin);
    if (path) {
      url.pathname = this.$$.trim(path, "/");
    }
    url.searchParams.set("reload", String(Date.now()));
    this.window!.location.href = url.toString();
  }
}
