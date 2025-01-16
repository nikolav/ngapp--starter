import { Injectable, inject, signal, effect, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import type { IAuthCreds } from "../types";
import { UseUtilsService, AppConfigService } from "../services";
import { schemaJwt } from "../schemas";

@Injectable({
  providedIn: "root",
})
export class ApiAuthService {
  private $http: HttpClient = inject(HttpClient);

  private $$: UseUtilsService = inject(UseUtilsService);
  private $config: AppConfigService = inject(AppConfigService);

  token = signal("");
  account = signal<any>(null);
  profile = signal<any>(null);

  isAuth = computed(() => true === schemaJwt.safeParse(this.token()).success);

  constructor() {
    effect(() => {
      try {
        const token_ = schemaJwt.parse(this.token());
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
