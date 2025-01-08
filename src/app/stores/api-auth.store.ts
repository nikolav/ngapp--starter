import { Injectable, inject, signal, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import type { IAuthCreds } from "../types";
import { UseUtilsService, AppConfigService } from "../services";

@Injectable({
  providedIn: "root",
})
export class ApiAuthService {
  private $http: HttpClient = inject(HttpClient);
  private $$: UseUtilsService = inject(UseUtilsService);
  private $appConfig: AppConfigService = inject(AppConfigService);

  token = signal("");
  account: any = null;

  constructor() {
    effect(() => {
      try {
        const token_ = this.token();
        if (!token_) return;
        // fetch account @token:signal
      } catch (error) {
        // pass
      }
    });
  }

  // api
  async authenticate(creds: IAuthCreds) {}
  async register(creds: IAuthCreds) {}
  async logout() {}
}
