import type { Injector, ViewContainerRef } from "@angular/core";
import type { GuardResult, MaybeAsync } from "@angular/router";
import type { OverlayConfig } from "@angular/cdk/overlay";
import type { Subscription } from "rxjs";

import type {
  JsonDataRecord as TRecordJson,
  TJson,
  TJsonLiteral,
} from "../schemas/json.schema";
import type { Point as PointPopupDetached } from "./models";

export type ElementOf<T extends readonly unknown[]> = T[number];
export type TFunctionVoid = (...args: any[]) => void;
export type TOrNoValue<T = any> = T | undefined | null;
export type THasId<T = any> = T & { id: any };
export type TSize = { width?: number | string; height?: number | string };
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

export interface IEventApp<TEventAppPayload = unknown> {
  type: string;
  payload: TEventAppPayload;
}
export interface IEventOnStorage<TPayload = unknown>
  extends IEventApp<TPayload> {
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
export interface IDocsPatchInput {
  merge?: boolean;
  data: {
    id?: any;
    [key: string]: unknown;
  };
}
export type TCleanupCallback = (doneCallback: TFunctionVoid) => void;
export type TOverlayConfig = Omit<
  OverlayConfig,
  "positionStrategy" | "scrollStrategy"
>;
export type THiddenOrVisible = "hidden" | "visible";

export interface ITriggerFadeSlideConfig {
  name?: any;
  offsetX?: any;
  offsetY?: any;
  duration?: any;
  ease?: any;
}
export interface ITriggerFadeScaleConfig {
  name?: any;
  scale?: any;
  duration?: any;
  ease?: any;
}
export type TScrollStrategyName = "reposition" | "close" | "block" | "noop";
export interface CdkPortalFactoryOptions {
  // Required for TemplatePortal (and for ComponentPortal if you want a specific host)
  viewContainerRef?: ViewContainerRef;
  // Optional: pass context for <ng-template let-...>
  context?: Record<string, unknown>;
  // Optional injector for TemplatePortal / ComponentPortal
  injector?: Injector;
  // Optional: custom DI for ComponentPortal (takes priority over injector)
  componentInjector?: Injector;
  // Optional: projected nodes into component (rare; matches ComponentPortal signature)
  projectableNodes?: Node[][];
}
export interface IPopupDetachedOverlayOptions {
  // Position source
  point?: PointPopupDetached; // direct [x,y]
  event?: PointerEvent | MouseEvent; // from click / pointerdown etc

  // relative to viewport (global strategy)
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;

  // centering in viewport
  centered?: boolean;
  centeredX?: boolean;
  centeredY?: boolean;

  // Optional offsets applied after computing point / side anchors
  offsetX?: number;
  offsetY?: number;

  // CSS units allowed
  size?: TSize;
  fullscreen?: boolean;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;

  // UI defaults
  hasBackdrop?: boolean;
  backdropClass?: string;
  panelClass?: string | string[];
  fullscreenClass?: string | string[];
  scrolling?: TScrollStrategyName;

  // Behavior
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;

  // Advanced
  direction?: OverlayConfig["direction"];
  disposeOnNavigation?: boolean;
}
export interface INormalizedOverlayOptions
  extends Omit<
    IPopupDetachedOverlayOptions,
    "panelClass" | "fullscreenClass" | "hasBackdrop"
  > {
  fullscreen: boolean;
  fullscreenClass: string[];
  hasBackdrop: boolean;
  panelClass: string[];
  offsetX: number;
  offsetY: number;
}

//##
export type { TRecordJson, TJson, TJsonLiteral, MaybeAsync as TMaybeAsync };
export type { ChartData, ChartOptions, ChartType } from "chart.js";
export type {
  TBreakpointsCustom,
  TBreakpointCustom,
  TBreakpointKeyCustom,
} from "../assets/breakpoints";
