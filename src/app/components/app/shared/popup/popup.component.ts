import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import type { AnimationEvent } from "@angular/animations";
import { CdkPortal } from "@angular/cdk/portal";
import { ConnectedPosition, Overlay, OverlayRef } from "@angular/cdk/overlay";

import {
  THiddenOrVisible,
  TOrNoValue,
  TOverlayConfig,
  TScrollStrategyName,
} from "../../../../types";
import { transformOverlayOffsets } from "../../../../schemas";
import { UseUtilsService } from "../../../../services";

@Component({
  selector: "app-popup",
  imports: [CdkPortal],
  templateUrl: "./popup.component.html",
  styleUrl: "./popup.component.scss",
})
export class PopupConnectedComponent {
  private $$ = inject(UseUtilsService);
  private $overlay = inject(Overlay);

  protected portal = viewChild(CdkPortal);

  protected overlayRef = signal<TOrNoValue<OverlayRef>>(null);

  private readonly DEFAULT_POSTIONS: ConnectedPosition[] = [
    {
      originX: "start",
      originY: "bottom",
      overlayX: "start",
      overlayY: "top",
    },
  ];
  private readonly DEFAULT_PANEL_CLASS =
    "overlay-panel-5f90625f-2667-59d8-9c18-1b831aa465c1";
  private readonly DEFAULT_CONFIG: TOverlayConfig = {
    panelClass: this.DEFAULT_PANEL_CLASS,
  };

  // @@ # animations.state
  readonly state = model<THiddenOrVisible>("hidden");
  hidden() {
    this.state.set("hidden");
  }
  visible() {
    this.state.set("visible");
  }

  // @@ # defines how the overlay is aligned relative to the trigger
  positions = input<ConnectedPosition[]>([]);
  // @@ # locks overlay to the first successful position
  positionsLock = input(undefined, { transform: booleanAttribute });
  // @@ # "offsetX offsetY"
  offset = input<string>("0 0");
  // @@ # overlay will never touch screen edges closer than this margin
  viewportMargin = input(0);
  // @@ # allows overlay to shrink to fit viewport
  flexible = input(undefined, { transform: booleanAttribute });
  // @@ # pushes overlay into view instead of clipping
  push = input(undefined, { transform: booleanAttribute });
  // @@ # allows overlay to resize after initial render
  grow = input(undefined, { transform: booleanAttribute });
  // @@ # sets CSS transform-origin dynamically
  transformOrigin = input<string>(this.DEFAULT_PANEL_CLASS);
  // @@ # scrollStrategy
  scrolling = input<TScrollStrategyName>("reposition");

  // @@
  clickOutside = output<void>();

  // @@
  readonly isOpened = computed(() => null != this.overlayRef());

  protected offset_ = computed(() => {
    try {
      return transformOverlayOffsets.parse(this.offset());
    } catch (error) {
      // pass
    }
    return [0, 0];
  });

  protected scrollStrategy_ = computed(
    () =>
      ({
        reposition: this.$overlay.scrollStrategies.reposition(),
        block: this.$overlay.scrollStrategies.block(),
        close: this.$overlay.scrollStrategies.close(),
        noop: this.$overlay.scrollStrategies.noop(),
      }[this.scrolling()])
  );

  constructor() {
    // @detach state hidden
    effect((cleanup) => {
      const sbs = this.overlayRef()
        ?.detachments()
        .subscribe(() => this.hidden());
      cleanup(() => sbs?.unsubscribe());
    });
    // @clickOutside emit
    effect((cleanup) => {
      const sbs = this.overlayRef()
        ?.outsidePointerEvents()
        .subscribe(() => this.clickOutside.emit());
      cleanup(() => sbs?.unsubscribe());
    });
  }

  // @@
  open(trigger: any, overlayConfig?: TOverlayConfig) {
    if (this.isOpened()) return;
    try {
      this.overlayRef.set(
        this.$overlay.create({
          // position --connected
          positionStrategy: this.$overlay
            .position()
            .flexibleConnectedTo(trigger)
            .withPositions([...this.positions(), ...this.DEFAULT_POSTIONS])
            .withDefaultOffsetX(this.offset_()[0])
            .withDefaultOffsetY(this.offset_()[1])
            .withViewportMargin(this.viewportMargin())
            .withFlexibleDimensions(this.flexible())
            .withPush(this.push())
            .withLockedPosition(this.positionsLock())
            .withGrowAfterOpen(this.grow())
            .withTransformOriginOn(this.transformOrigin()),
          // scrolling --default-reposition
          scrollStrategy: this.scrollStrategy_(),
          // config
          ...this.$$.copy({}, this.DEFAULT_CONFIG, overlayConfig),
        })
      );
      this.overlayRef()!.attach(this.portal()!);
      this.visible();
    } catch (error) {
      // pass
    }
  }

  // @@
  close() {
    this.overlayRef()?.dispose();
    this.overlayRef.set(null);
  }

  // @@
  toggle(trigger: any, overlayConfig?: TOverlayConfig) {
    if (this.isOpened()) {
      // init close animation;
      //   autocloses @doneAnimation.done
      this.hidden();
      return;
    }
    // insert popup
    //   init open animation
    this.open(trigger, overlayConfig);
  }

  // @@
  onCloseAnimationDone(
    $event: AnimationEvent,
    hiddenState: THiddenOrVisible = "hidden"
  ) {
    if (hiddenState == $event.toState) {
      this.close();
    }
  }
}
