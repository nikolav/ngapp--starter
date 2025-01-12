import { GuardResult, MaybeAsync } from "@angular/router";

export {
  type JsonDataRecord as TRecordJson,
  type TJson,
  type TJsonLiteral,
} from "../schemas/json.schema";

export type TOrNoValue<T = any> = T | undefined | null;
export interface IAuthCreds {
  email: string;
  password: string;
}
export interface ICanComponentDeactivate {
  canDeactivate: () => MaybeAsync<GuardResult>;
}
