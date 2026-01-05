import {
  DestroyRef,
  Injectable,
  Injector,
  TemplateRef,
  inject,
  runInInjectionContext,
  signal,
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { Portal } from "@angular/cdk/portal";
import { from, of } from "rxjs";
import { filter, map, mergeMap, reduce } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import type { AnimationEvent } from "@angular/animations";

import type {
  CdkPortalFactoryOptions,
  IEventApp,
  IPopupDetachedOverlayOptions,
  TFunctionVoid,
  THiddenOrVisible,
} from "../../types";
import {
  AppConfigService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../utils";
import { CdkOverlayUtilsService } from "./cdk-overlay-utils.service";
import { TOKEN_emitterNavigation } from "../../keys";

// internal client for single overlayRef
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
    runInInjectionContext(optionsFactory.injector!, () => {
      this.$subs = new ManageSubscriptionsService();
    });

    // attach
    this.open();

    // @destroy callback:onDetached
    this.$subs.push({
      detachments: this.overlayRef.detachments().subscribe(() => {
        this.onDetached(this.key);
      }),
    });

    // @backdropClick
    if (this.optionsOverlay.closeOnBackdropClick) {
      this.$subs.push({
        backdropClick: this.overlayRef.backdropClick().subscribe(() => {
          this.close(false);
        }),
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

  // @@
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
  private readonly $destroyRef = inject(DestroyRef);

  private readonly $$ = inject(UseUtilsService);
  private readonly $overlayUtils = inject(CdkOverlayUtilsService);
  private readonly $emitterNav = inject(TOKEN_emitterNavigation);
  private readonly $config = inject(AppConfigService);

  private readonly SCROLL_STRATEGIES = {
    reposition: this.$overlay.scrollStrategies.reposition(),
    block: this.$overlay.scrollStrategies.block(),
    close: this.$overlay.scrollStrategies.close(),
    noop: this.$overlay.scrollStrategies.noop(),
  };
  private readonly DEFAULT_factoryOptions: CdkPortalFactoryOptions = {
    // viewContainerRef: ViewContainerRef,
    context: { $implicit: <any>{} },
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
    fullscreenClass: ["is-fullscreen"],
    scrolling: "reposition",

    // # Behavior
    // closeOnBackdropClick?: boolean;
    // closeOnEscape?: boolean;

    // # Advanced
    // direction?: OverlayConfig['direction']
    disposeOnNavigation: true,
  };
  // ## overlay size defaults
  // for non-fullscreen within viewport with a small margin by default
  // private readonly DEFAULT_MaxWidth = "calc(100vw - 16px)";
  // private readonly DEFAULT_MaxHeight = "calc(100vh - 16px)";
  private readonly DEFAULT_MaxWidth = "100vw";
  private readonly DEFAULT_MaxHeight = "100vh";
  private readonly DEFAULT_concurrency = 10;

  // @@
  readonly overlays = <IOverlayRefHandles>{};

  constructor() {
    // close:hard all popups @nav
    if (this.$config.app.DESTROY_POPUPS_ON_NAV_START) {
      this.$emitterNav
        .pipe(
          filter(
            (event: IEventApp) =>
              this.$config.events.ROUTER_NAVIGATION_START === event.type
          ),
          takeUntilDestroyed(this.$destroyRef)
        )
        .subscribe((_event) => {
          this.destroy();
        });
    }
  }

  // @@
  // # state('popup_x')
  state = (key: string) => this.overlays[key]?.state() ?? false;

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
          const optionsOverlay_ = this.$overlayUtils.overlayOptionsNormalized(
            this.$$.copy(
              <IPopupDetachedOverlayOptions>{},
              this.DEFAULT_overlayOptions,
              overlayOptions
            )
          );

          // generate OverlayConfig
          // create OverlayRef
          const overlayConfig_ = this.$overlayUtils.createOverlayConfig(
            optionsOverlay_,

            // calc OverlayConfig.positionStrategy
            this.$overlayUtils.createGlobalPositionStrategy(optionsOverlay_),

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
            // @detachment
            // clear from .overlays cache
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
    this.$$.each(this.overlays, (handle) => {
      handle.close(true);
    });
  }
}
