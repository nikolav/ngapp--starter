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

import { TOKEN_onBrowser$, TOKEN_windowDefaultView } from "../keys";
import { UseDomAccessService } from "../services";

@Directive({ selector: "[appObserveResize]" })
export class ObserveResizeDirective {
  private hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private $c = inject(UseDomAccessService);
  private win = inject(TOKEN_windowDefaultView);
  private browser = toSignal(inject(TOKEN_onBrowser$), { initialValue: false });

  // (@)
  readonly resize = output<ResizeObserverEntry>({ alias: "appObserveResize" });

  // [@]
  readonly enabled = input(true, {
    alias: "appObserveResizeEnabled",
    transform: booleanAttribute,
  });

  constructor() {
    effect((cleanup) => {
      if (!this.browser() || !this.enabled()) return;
      if (!this.win || !("ResizeObserver" in this.win)) return;

      const el = this.$c.ngUnwrapElement(this.hostRef);

      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        this.resize.emit(entry);
      });

      ro.observe(el);

      cleanup(() => {
        ro.disconnect();
      });
    });
  }
}
