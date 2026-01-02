import {
  Injectable,
  Injector,
  TemplateRef,
  inject,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  GlobalPositionStrategy,
  PositionStrategy,
  ScrollStrategy,
} from "@angular/cdk/overlay";
import { Portal } from "@angular/cdk/portal";
import { from, of } from "rxjs";
import { filter, map, mergeMap, reduce } from "rxjs/operators";
import type { AnimationEvent } from "@angular/animations";

import { ManageSubscriptionsService, UseUtilsService } from "../utils";
import type {
  CdkPortalFactoryOptions,
  IPopupDetachedOverlayOptions,
  TFunctionVoid,
  THiddenOrVisible,
} from "../../types";

export class Point {
  constructor(public x: number, public y: number) {}
  static from(p: { x: number; y: number }) {
    return new Point(p.x, p.y);
  }
  static fromEvent(event: PointerEvent | MouseEvent) {
    return new Point(event.clientX, event.clientY);
  }
}

export class OverlayRefHandle {
  private $subs!: ManageSubscriptionsService;

  // @@ toggle state for animations
  readonly state = signal<THiddenOrVisible>("hidden");
  hidden() {
    this.state.set("hidden");
  }
  visible() {
    this.state.set("visible");
  }

  //
  constructor(
    public key: string,
    public overlayRef: OverlayRef,
    public portal: Portal<unknown>,
    public optionsOverlay: IPopupDetachedOverlayOptions,
    public optionsFactory: CdkPortalFactoryOptions,
    public onDetached: TFunctionVoid
  ) {
    // attach
    this.open();

    runInInjectionContext(optionsFactory.injector!, () => {
      this.$subs = new ManageSubscriptionsService();
    });

    // @destroy callback:onDetached
    this.$subs.push({
      detachments: this.overlayRef.detachments().subscribe(() => {
        this.onDetached(this.key);
      }),
    });

    // @backdropClick
    if (this.optionsOverlay.closeOnBackdropClick) {
      this.$subs.push({
        backdropClick: this.overlayRef
          .backdropClick()
          .subscribe(() => this.close(false)),
      });
    }

    // @keydownEvents
    if (this.optionsOverlay.closeOnEscape) {
      this.$subs.push({
        keydownEvents: this.overlayRef.keydownEvents().subscribe((e) => {
          if ("Escape" === e.key) this.close(false);
        }),
      });
    }

    // init animations
    this.visible();
  }
  isOpened() {
    return this.overlayRef.hasAttached();
  }

  // @@
  open() {
    if (!this.isOpened()) {
      this.overlayRef.attach(this.portal);
    }
  }

  // @@
  close(force = true) {
    if (!this.isOpened()) return;
    if (force) {
      this.destroy();
      return;
    }
    this.hidden();
  }

  // @@
  onCloseAnimationDone(
    event: AnimationEvent,
    hiddenState: THiddenOrVisible = "hidden"
  ) {
    if (hiddenState == event.toState) {
      this.close(true);
    }
  }
  // @@
  destroy() {
    this.overlayRef.dispose();
    this.$subs.destroy();
  }
}

export interface IOverlayRefHandles {
  [key: string]: OverlayRefHandle;
}

@Injectable({ providedIn: "root" })
export class PopupDetachedService {
  private readonly $injector = inject(Injector);
  private readonly $overlay = inject(Overlay);

  private $$ = inject(UseUtilsService);

  private readonly SCROLL_STRATEGIES = {
    reposition: this.$overlay.scrollStrategies.reposition(),
    block: this.$overlay.scrollStrategies.block(),
    close: this.$overlay.scrollStrategies.close(),
    noop: this.$overlay.scrollStrategies.noop(),
  };

  private readonly DEFAULT_factoryOptions: CdkPortalFactoryOptions = {
    // viewContainerRef: ViewContainerRef,
    // context?: Record<string, unknown>;
    injector: this.$injector,
    // componentInjector?: Injector;
    // projectableNodes?: Node[][];
  };
  private readonly DEFAULT_overlayOptions: IPopupDetachedOverlayOptions = {
    // # Position source
    // point?: Point; // direct [x,y]
    // event?: PointerEvent | MouseEvent; // from click / pointerdown etc

    // # centering in viewport
    // centered?: boolean;
    // centeredX?: boolean;
    // centeredY?: boolean;

    // # Optional offsets applied after computing point
    offsetX: 0,
    offsetY: 0,

    // # CSS units allowed
    // fullscreen?: boolean;
    // size?: TSize;
    // minWidth?: number | string;
    // minHeight?: number | string;
    // maxWidth?: number | string;
    // maxHeight?: number | string;

    // # UI defaults
    hasBackdrop: false,
    // backdropClass: "cdk-overlay-dark-backdrop",
    backdropClass: "cdk-overlay-dark-backdrop-blured",
    panelClass: ["global-overlay-panel"],
    scrolling: "reposition",

    // # Behavior
    // closeOnBackdropClick?: boolean;
    // closeOnEscape?: boolean;

    // # Advanced
    disposeOnNavigation: true,
  };
  // ## overlay size defaults
  // for non-fullscreen, keep it within viewport with a small margin by default.
  private readonly DEFAULT_MaxWidth = "calc(100vw - 16px)";
  private readonly DEFAULT_MaxHeight = "calc(100vh - 16px)";
  private readonly DEFAULT_concurrency = 10;

  readonly overlays = <IOverlayRefHandles>{};

  // @@
  state(key: string) {
    return this.overlays[key]?.state() ?? false;
  }

  // @@
  // { [popupKey: string]: force:boolean }
  close = (keys: Record<string, boolean>) => {
    this.$$.each(keys, (value, key) => {
      this.overlays[key]?.close(value);
    });
  };

  // @@
  // open targets:TemplateRefs using config
  // store refs @overlays under provided keys
  open = <T = unknown>(
    portalsConfig: Record<
      string,
      {
        target: TemplateRef<T>;
        overlayOptions: IPopupDetachedOverlayOptions;
        factoryOptions?: CdkPortalFactoryOptions;
      }
    >
  ) => {
    return from(this.$$.entries(portalsConfig)).pipe(
      // skip opened overlays
      filter(([key, _rest]) => {
        return !this.overlays[key]?.isOpened();
      }),

      // push overlay handles
      mergeMap(([key, { target, overlayOptions, factoryOptions }]) => {
        let error_: any = null;
        try {
          // merge factoryOptions for templates or component portal
          const optionsFactory_ = this.$$.copy(
            <CdkPortalFactoryOptions>{},
            this.DEFAULT_factoryOptions,
            factoryOptions
          );

          // merge overlay options
          const optionsOverlay_ = this.$$.copy(
            <IPopupDetachedOverlayOptions>{},
            this.DEFAULT_overlayOptions,
            overlayOptions
          );

          // generate OverlayConfig
          // create OverlayRef
          const overlayConfig_ = createOverlayConfig(
            optionsOverlay_,

            // calc OverlayConfig.positionStrategy
            createGlobalPositionStrategy(this.$overlay, optionsOverlay_),

            // calc OverlayConfig.scrollStrategy
            this.SCROLL_STRATEGIES[optionsOverlay_.scrolling ?? "reposition"],

            //
            this.DEFAULT_MaxWidth,
            this.DEFAULT_MaxHeight
          );
          const overlayRef = this.$overlay.create(overlayConfig_);

          // init overlay handle
          const portal = this.$$.ngTemplateToPortal(target, optionsFactory_);
          this.overlays[key] = new OverlayRefHandle(
            key,
            overlayRef,
            portal,
            optionsOverlay_,
            optionsFactory_,
            // .onDetached(); drop key
            (key: string) => {
              delete this.overlays[key];
            }
          );

          // @success:result
          return of(this.$$.res({ key, overlayRef }, null));
        } catch (error) {
          error_ = error;
          this.$$.onDebug({ "@error --popup-detached --open": error_ });
        }

        // @default pass error
        return of(this.$$.res(null, error_));
      }, this.DEFAULT_concurrency),

      // accumulate results
      reduce((accum, res) => {
        if (res.error) {
          (<any[]>accum.error).push(res.error);
        } else {
          this.$$.copy(<any>accum.result, res.result);
        }
        return accum;
      }, this.$$.res(<any>{}, <any[]>[])),

      // flatten
      map((res) => res.dump())
    );
  };

  // @@
  // force close all popups
  destroy() {
    this.$$.transform(
      this.overlays,
      (accum, handle, key) => {
        handle?.close(true);
        delete accum[key];
      },
      this.overlays
    );
  }
}

// --utils
function px(v: number) {
  return `${Math.round(v)}px`;
}

/**
 * Build OverlayConfig for overlay.create(config) from IPopupDetachedOverlayOptions.
 * - positionStrategy + scrollStrategy are provided (already calculated elsewhere)
 * - sets sane defaults for sizing/backdrop/classes/navigation
 */
function createOverlayConfig(
  opts: IPopupDetachedOverlayOptions,
  positionStrategy: PositionStrategy,
  scrollStrategy: ScrollStrategy,
  //
  defaultMaxWidth: string | number,
  defaultMaxHeight: string | number
): OverlayConfig {
  // If fullscreen, force viewport-sized overlay unless user overrides explicitly.
  const fullscreen = !!opts.fullscreen;

  // Normalize panelClass to array (CDK accepts string|string[])
  const panelClass = normalizeClasses(
    opts.panelClass,
    fullscreen ? ["is-fullscreen"] : []
  );

  // If fullscreen, default to full viewport. Otherwise use opts.size if provided.
  const width = fullscreen ? opts.size?.width ?? "100vw" : opts.size?.width;
  const height = fullscreen ? opts.size?.height ?? "100vh" : opts.size?.height;

  const maxWidth = opts.maxWidth ?? (fullscreen ? "100vw" : defaultMaxWidth);
  const maxHeight = opts.maxHeight ?? (fullscreen ? "100vh" : defaultMaxHeight);

  return <OverlayConfig>{
    positionStrategy,
    scrollStrategy,
    hasBackdrop: opts.hasBackdrop,
    backdropClass: opts.backdropClass,
    panelClass,
    disposeOnNavigation: opts.disposeOnNavigation,

    width,
    height,
    minWidth: opts.minWidth,
    minHeight: opts.minHeight,
    maxWidth,
    maxHeight,
  };
}

function normalizeClasses(
  input: string | string[] | undefined,
  defaults: string[]
): string[] {
  const arr = Array.isArray(input) ? input : input ? [input] : [];
  // merge defaults + user classes, keep order, de-dupe
  const out: string[] = [];
  for (const c of [...defaults, ...arr]) {
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

/**
 * Factory: creates GlobalPositionStrategy for OverlayConfig.positionStrategy
 *
 * Priority:
 * 1) point/event => absolute left/top (plus offsets)
 * 2) fullscreen  => top-left anchored (size handled in OverlayConfig, not here)
 * 3) centered    => centerHorizontally/centerVertically (centered implies both axes)
 * 4) fallback    => use provided offsets with optional centeredX/Y; otherwise top-left (0,0)
 */
function createGlobalPositionStrategy(
  overlay: Overlay,
  opts: IPopupDetachedOverlayOptions = {}
): GlobalPositionStrategy {
  const s = overlay.position().global();

  const offsetX = opts.offsetX ?? 0;
  const offsetY = opts.offsetY ?? 0;

  // 1) event/point positioning
  const p = opts.event ? Point.fromEvent(opts.event) : opts.point;
  if (p) {
    // left/top use viewport coordinates; global strategy is fixed to viewport
    return s.left(px(p.x + offsetX)).top(px(p.y + offsetY));
  }

  // 2) fullscreen (position only; width/height should be set on OverlayConfig)
  if (opts.fullscreen) {
    return s.left(px(offsetX)).top(px(offsetY));
  }

  // 3) centered (implies both axes)
  const centeredX = !!(opts.centered || opts.centeredX);
  const centeredY = !!(opts.centered || opts.centeredY);

  // If centered in both axes, prefer CDK centering API.
  if (centeredX && centeredY) {
    // NOTE: CDK allows centering with optional offsets.
    return s.centerHorizontally(px(offsetX)).centerVertically(px(offsetY));
  }

  // Partial centering is tricky because GlobalPositionStrategy can’t be both centered
  // on one axis and explicitly left/top on the other in a perfect “mixed” way without
  // knowing size. We handle the common cases:
  if (centeredX && !centeredY) {
    // center X, set top
    return s.centerHorizontally(px(offsetX)).top(px(offsetY));
  }

  if (!centeredX && centeredY) {
    // left, center Y
    return s.left(px(offsetX)).centerVertically(px(offsetY));
  }

  // 4) fallback: top-left with offsets (or 0,0)
  return s.left(px(offsetX)).top(px(offsetY));
}
