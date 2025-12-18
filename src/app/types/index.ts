import { GuardResult, MaybeAsync } from "@angular/router";
import { type Subscription } from "rxjs";
import type {
  JsonDataRecord as TRecordJson,
  TJson,
  TJsonLiteral,
} from "../schemas/json.schema";

export type TFunctionVoid = (...args: any[]) => void;
export type TOrNoValue<T = any> = T | undefined | null;
export type THasId<T = any> = T & { id: any };
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
export interface IUploadFile {
  file: File;
  path?: string;
}
export type TUploadFiles = Record<string, IUploadFile>;

// ==store:flags
export interface ISToreFlagsCache {
  [name: string]: boolean;
}

export type TManageSubscriptionsCache = Record<
  string,
  TOrNoValue<Subscription>
>;
export interface IRecordJsonWithMergeFlag {
  merge?: boolean;
  data: TRecordJson;
}

export interface ICollectionsPatchInput {
  merge?: boolean;
  data: {
    id?: any;
    data: TRecordJson;
  };
}

export interface IResultCollectionsDocs {
  collectionsDocsByTopic: {
    error: any;
    status: TRecordJson[];
  };
}

export interface IEventApp {
  type: string;
  payload: any;
}
export interface IEventOnStorage extends IEventApp {
  action: "push" | "drop";
}
export type PickFileOptions = {
  /** Accept attribute: e.g. "image/*,.pdf,.csv" */
  accept?: string;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Mobile camera/mic hint: "user" | "environment" */
  capture?: "user" | "environment";
  /** Chrome-only directory pick (non-standard) */
  directory?: boolean; // uses webkitdirectory under the hood
};

//##
export type { TRecordJson, TJson, TJsonLiteral, MaybeAsync as TMaybeAsync };
export type { ChartData, ChartOptions, ChartType } from "chart.js";
export * from "./models";
