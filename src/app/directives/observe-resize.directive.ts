import {
  Directive,
  ElementRef,
  inject,
  effect,
  output,
  input,
  booleanAttribute,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

import { TOKEN_isSupported_ResizeObserver$ } from "../keys";
import { UseUtilsService } from "../services";

@Directive({ selector: "[appObserveResize]" })
export class ObserveResizeDirective {
  // $
  private $$ = inject(UseUtilsService);

  // #
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  // .
  private readonly supported = toSignal(
    inject(TOKEN_isSupported_ResizeObserver$),
    { initialValue: false }
  );

  // (@)
  readonly resize = output<globalThis.ResizeObserverEntry>({
    alias: "appObserveResize",
  });

  // [@]
  readonly disabled = input(false, {
    alias: "appObserveResizeDisabled",
    transform: booleanAttribute,
  });

  // [@]
  readonly box = input<globalThis.ResizeObserverBoxOptions>("content-box", {
    alias: "appObserveResizeBox",
  });

  constructor() {
    effect((cleanup) => {
      if (this.disabled() || !this.supported()) return;

      const el = this.host.nativeElement;

      const ro = new ResizeObserver((entries) => {
        if (this.$$.isEmpty(entries)) return;
        for (const entry of entries) {
          this.resize.emit(entry);
        }
      });

      ro.observe(el, { box: this.box() });

      cleanup(() => {
        ro.disconnect();
      });
    });
  }
}
