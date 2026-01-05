import { inject, Injectable } from "@angular/core";
import {
  Overlay,
  OverlayConfig,
  PositionStrategy,
  ScrollStrategy,
} from "@angular/cdk/overlay";

import { UseUtilsService } from "../utils";
import { Point } from "../../types/models";
import type {
  INormalizedOverlayOptions,
  IPopupDetachedOverlayOptions,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class CdkOverlayUtilsService {
  private readonly $overlay = inject(Overlay);

  private readonly $$ = inject(UseUtilsService);

  px(v: number) {
    return `${Math.round(v)}px`;
  }
  /** Keep numbers as px; pass strings through (%, vw, calc(), etc.) */
  cssLen(v?: number | string) {
    return null != v
      ? this.$$.isNumeric(v)
        ? this.px(Number(v))
        : String(v)
      : v;
  }

  /**
   * Normalize overlay options to:
   * - resolve booleans
   * - normalize classes -> string[]
   * - default hasBackdrop when a backdropClass is provided
   * - default offsets
   */
  overlayOptionsNormalized(opts: IPopupDetachedOverlayOptions = {}) {
    const fullscreen = !!opts.fullscreen;

    const fullscreenClass = this.$$.normalizedSet(opts.fullscreenClass);
    const panelClass = this.$$.normalizedSet(opts.panelClass, [
      ...(fullscreen ? ["is-fullscreen"] : []),
      ...(fullscreen ? fullscreenClass : []),
    ]);

    // If user provided a backdropClass but forgot hasBackdrop, assume true.
    const hasBackdrop =
      typeof opts.hasBackdrop === "boolean"
        ? opts.hasBackdrop
        : !!opts.backdropClass;

    return <INormalizedOverlayOptions>{
      ...opts,
      fullscreen,
      hasBackdrop,
      panelClass,
      fullscreenClass,
      offsetX: opts.offsetX ?? 0,
      offsetY: opts.offsetY ?? 0,
    };
  }

  /**
   * Factory: creates GlobalPositionStrategy for OverlayConfig.positionStrategy
   *
   * Priority:
   * 1) fullscreen
   * 2) centered (centeredX/Y or centered)
   * 3) point/event => absolute left/top (plus offsets)
   * 4) 4-sides positioning (top/right/bottom/left) (plus offsets)
   * 5) fallback => top-left (0,0) with offsets
   *
   * Notes:
   * - This is viewport-relative (GlobalPositionStrategy).
   * - Offsets are applied in the “natural” direction:
   *   left/top: +offset, right/bottom: -offset
   */
  createGlobalPositionStrategy(opts: INormalizedOverlayOptions) {
    const s = this.$overlay.position().global();

    // (1) event/point positioning
    const p = opts.event ? Point.fromEvent(opts.event) : opts.point;
    if (p) {
      return s
        .left(this.px(p.x + opts.offsetX))
        .top(this.px(p.y + opts.offsetY));
    }

    // (2) fullscreen: anchor top-left; sizing handled in OverlayConfig
    if (opts.fullscreen) {
      return s.left(this.px(opts.offsetX)).top(this.px(opts.offsetY));
    }

    const centeredX = !!(opts.centered || opts.centeredX);
    const centeredY = !!(opts.centered || opts.centeredY);

    // (3) centered: higher priority than point/sides
    if (centeredX && centeredY) {
      return s
        .centerHorizontally(this.px(opts.offsetX))
        .centerVertically(this.px(opts.offsetY));
    }
    if (centeredX && !centeredY) {
      // center X, allow top/bottom if provided, else use offsetY top
      if (opts.top != null)
        return s
          .centerHorizontally(this.px(opts.offsetX))
          .top(this.cssLen(opts.top)!);
      if (opts.bottom != null)
        return s
          .centerHorizontally(this.px(opts.offsetX))
          .bottom(this.cssLen(opts.bottom)!);
      return s
        .centerHorizontally(this.px(opts.offsetX))
        .top(this.px(opts.offsetY));
    }
    if (!centeredX && centeredY) {
      // center Y, allow left/right if provided, else use offsetX left
      if (opts.left != null)
        return s
          .left(this.cssLen(opts.left)!)
          .centerVertically(this.px(opts.offsetY));
      if (opts.right != null)
        return s
          .right(this.cssLen(opts.right)!)
          .centerVertically(this.px(opts.offsetY));
      return s
        .left(this.px(opts.offsetX))
        .centerVertically(this.px(opts.offsetY));
    }

    // (4) side anchors: support any combination of top/right/bottom/left.
    // Apply offsets with direction:
    // - left/top => +offset
    // - right/bottom => -offset
    let hasAnySide = false;

    if (opts.left != null) {
      hasAnySide = true;
      const left = this.cssLen(opts.left);
      // If left is numeric px we can apply offset; if string (%, calc), safest is ignore numeric offset.
      if (typeof opts.left === "number")
        s.left(this.px(opts.left + opts.offsetX));
      else s.left(left!);
    }

    if (opts.right != null) {
      hasAnySide = true;
      const right = this.cssLen(opts.right);
      if (typeof opts.right === "number")
        s.right(this.px(opts.right - opts.offsetX));
      else s.right(right!);
    }

    if (opts.top != null) {
      hasAnySide = true;
      const top = this.cssLen(opts.top);
      if (typeof opts.top === "number") s.top(this.px(opts.top + opts.offsetY));
      else s.top(top!);
    }

    if (opts.bottom != null) {
      hasAnySide = true;
      const bottom = this.cssLen(opts.bottom);
      if (typeof opts.bottom === "number")
        s.bottom(this.px(opts.bottom - opts.offsetY));
      else s.bottom(bottom!);
    }

    if (hasAnySide) return s;

    // (5) fallback: top-left with offsets
    return s.left(this.px(opts.offsetX)).top(this.px(opts.offsetY));
  }

  /**
   * Build OverlayConfig for overlay.create(config) from INormalizedOverlayOptions.
   * - positionStrategy + scrollStrategy are provided
   * - sets sane defaults for sizing/backdrop/classes/navigation
   */
  createOverlayConfig(
    opts: INormalizedOverlayOptions,
    positionStrategy: PositionStrategy,
    scrollStrategy: ScrollStrategy,
    defaultMaxWidth: string | number,
    defaultMaxHeight: string | number
  ) {
    // If fullscreen, default to viewport-sized overlay unless user overrides explicitly.
    const width = opts.fullscreen
      ? opts.size?.width ?? "100vw"
      : opts.size?.width;
    const height = opts.fullscreen
      ? opts.size?.height ?? "100vh"
      : opts.size?.height;

    const maxWidth =
      opts.maxWidth ?? (opts.fullscreen ? "100vw" : defaultMaxWidth);
    const maxHeight =
      opts.maxHeight ?? (opts.fullscreen ? "100vh" : defaultMaxHeight);

    return <OverlayConfig>{
      positionStrategy,
      scrollStrategy,

      width,
      height,
      minWidth: opts.minWidth,
      minHeight: opts.minHeight,
      maxWidth,
      maxHeight,

      hasBackdrop: opts.hasBackdrop,
      backdropClass: opts.backdropClass,
      panelClass: opts.panelClass,

      direction: opts.direction,
      disposeOnNavigation: opts.disposeOnNavigation,
    };
  }
}
