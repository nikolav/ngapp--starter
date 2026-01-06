import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { TOKEN_isSupported_ResizeObserver$ } from "../keys";
import type { TOrNoValue } from "../types";
import { UseDomAccessService } from "../services";

@Directive({
  selector: "[appMeasureElement]",
  exportAs: "appMeasureElement",
})
export class MeasureElementDirective {
  // $
  private $c = inject(UseDomAccessService);

  // #
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  // _
  private readonly supported = toSignal(
    inject(TOKEN_isSupported_ResizeObserver$),
    { initialValue: false }
  );

  // [@]
  readonly disabled = input(false, {
    alias: "appMeasureElementDisabled",
    transform: booleanAttribute,
  });

  // [@]
  readonly box = input<globalThis.ResizeObserverBoxOptions>("border-box", {
    alias: "appMeasureElementBox",
  });

  // @
  readonly width = signal<TOrNoValue<number>>(undefined);
  // @
  readonly height = signal<TOrNoValue<number>>(undefined);
  // @
  readonly rect = signal<TOrNoValue<globalThis.DOMRectReadOnly>>(undefined);

  constructor() {
    effect((cleanup) => {
      if (this.disabled() || !this.supported()) {
        this.width.set(undefined);
        this.height.set(undefined);
        this.rect.set(undefined);
        return;
      }

      const target = this.host.nativeElement;

      // initial best-effort measure, don't wait for first ro tick
      // viewport-based "good enough" as initial value
      // resizeobserver callback provides canonical measurement after
      try {
        const m = this.$c.measureElement[this.box()](target);
        this.width.set(m.width);
        this.height.set(m.height);
        this.rect.set(m.rect);
      } catch {
        // ignore
      }

      const observer_ = new ResizeObserver((entries) => {
        if (!entries.length) return;

        const entry = entries[0];
        const size = this.$c.sizeFromResizeObserverEntry(entry);

        // update width/height
        this.width.set(size.width);
        this.height.set(size.height);

        // .contentRect is not always "the same rect" as box sizes
        this.rect.set(entry.contentRect);
      });

      observer_.observe(target, { box: this.box() });

      cleanup(() => {
        observer_.disconnect();
      });
    });
  }
}
