import { GuardResult, MaybeAsync } from "@angular/router";

import {
  JsonDataRecord as TRecordJson,
  TJson,
  TJsonLiteral,
} from "../schemas/json.schema";

export type { TRecordJson, TJson, TJsonLiteral };

export type TOrNoValue<T = any> = T | undefined | null;
export interface IAuthCreds {
  email: string;
  password: string;
}
export interface ICanComponentDeactivate {
  canDeactivate: () => MaybeAsync<GuardResult>;
}

export interface IResultApolloCacheService {
  cacheRedisGetCacheByKey: {
    error: any;
    status: { cache: TRecordJson };
  };
}
