import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import { TemplatePortal } from "@angular/cdk/portal";
import { ConnectedPosition, Overlay, OverlayRef } from "@angular/cdk/overlay";
import { AnimationEvent } from "@angular/animations";

import {
  THiddenOrVisible,
  TOrNoValue,
  TOverlayConfig,
} from "../../../../types";
import { transformOverlayOffsets } from "../../../../schemas";
import { UseUtilsService } from "../../../../services";
import { ClickOutsideDirective } from "../../../../directives";

@Component({
  selector: "app-popup",
  imports: [ClickOutsideDirective],
  templateUrl: "./popup.component.html",
  styleUrl: "./popup.component.scss",
})
export class PopupConnectedComponent {
  private $$ = inject(UseUtilsService);
  private vcr = inject(ViewContainerRef);
  private $overlay = inject(Overlay);

  protected overlayRef = signal<TOrNoValue<OverlayRef>>(null);
  protected tmpl = viewChild("tmplOverlay", { read: TemplateRef });

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
  state = model<THiddenOrVisible>("hidden");
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

  // @@
  clickOutside = output<void>();

  protected offset_ = computed(() => {
    try {
      return transformOverlayOffsets.parse(this.offset());
    } catch (error) {
      // pass
    }
    return [0, 0];
  });

  // @@
  readonly isOpened = computed(() => null != this.overlayRef());

  // @@
  open(trigger: any, overlayConfig?: TOverlayConfig) {
    if (this.isOpened()) return;
    try {
      this.overlayRef.set(
        this.$overlay.create({
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
          ...this.$$.copy({}, this.DEFAULT_CONFIG, overlayConfig),
        })
      );
      this.overlayRef()!.attach(new TemplatePortal(this.tmpl()!, this.vcr));
      //
      this.visible();
    } catch (error) {
      // pass
    }
  }

  // @@
  close() {
    this.overlayRef()?.dispose();
    this.overlayRef.set(null);
    //
    this.hidden();
  }

  // @@
  onCloseAnimationDone(
    $event: AnimationEvent,
    toState: THiddenOrVisible = "hidden"
  ) {
    if (toState == $event.toState) {
      this.close();
    }
  }
}
