import { Injectable } from '@angular/core';

import type { TOrNoValue, IAuthCreds } from '../types';
import { UseUtilsService, AppConfigService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  account: any = null;
  token: TOrNoValue<string> = null;
  constructor(
    private $$: UseUtilsService,
    private $$appConfig: AppConfigService
  ) {}
  async authenticate(creds: IAuthCreds) {}
  async register(creds: IAuthCreds) {}
  async logout() {}
}
