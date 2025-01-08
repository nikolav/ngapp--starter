import { Injectable, inject } from "@angular/core";
import { UseUtilsService } from "./use-utils.service";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private $$: UseUtilsService = inject(UseUtilsService);
  FOO = "BAR";
  DEMO = "DEMO:1";
  //
  PRODUCTION = false;
  // PRODUCTION = true;
  API_URL_dev = "http://localhost:5000";
  API_URL_production = "https://zyeqzw35h4kv5b70k7uqim.site";
  API_URL = this.$$.trimEnd(
    this.PRODUCTION ? this.API_URL_production : this.API_URL_dev,
    "/"
  );
}
