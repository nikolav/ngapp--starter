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

import { TOKEN_isBrowser$, TOKEN_windowDefaultView } from "../keys";
import { UseUtilsService } from "../services";

@Directive({ selector: "[appObserveResize]" })
export class ObserveResizeDirective {
  private hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private $$ = inject(UseUtilsService);
  private win = inject(TOKEN_windowDefaultView);
  private browser = toSignal(inject(TOKEN_isBrowser$), { initialValue: false });

  // (@)
  readonly resize = output<globalThis.ResizeObserverEntry>({
    alias: "appObserveResize",
  });

  // [@]
  readonly enabled = input(true, {
    alias: "appObserveResizeEnabled",
    transform: booleanAttribute,
  });

  // [@]
  readonly box = input<ResizeObserverBoxOptions>("content-box", {
    alias: "appObserveResizeBox",
  });

  constructor() {
    effect((cleanup) => {
      if (!this.browser() || !this.enabled()) return;
      if (!this.win || !("ResizeObserver" in globalThis)) return;

      const el = this.hostRef.nativeElement;

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
