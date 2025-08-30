import { inject, Injectable } from "@angular/core";
import { UseUtilsService } from "./use-utils.service";

@Injectable({
  providedIn: "root",
})
export class NavUtilsService {
  private $$ = inject(UseUtilsService);
  constructor() {}

  hardReload(path = "") {
    const url = new URL(window.location.origin);
    if (path) {
      url.pathname = this.$$.trim(path, "/");
    }
    url.searchParams.set("reload", String(Date.now()));
    window.location.href = url.toString();
  }
}
