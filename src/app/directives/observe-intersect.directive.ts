import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from "@angular/core";

import type { TOrNoValue } from "../types";
import { TOKEN_isSupprted_IntersectionObserver } from "../keys";
import { UseUtilsService } from "../services";

@Directive({
  selector: "[appObserveIntersect]",
})
export class ObserveIntersectDirective {
  // $
  private $$ = inject(UseUtilsService);

  // #
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // .
  private readonly supported = inject(TOKEN_isSupprted_IntersectionObserver);

  // (@)
  readonly intersect = output<globalThis.IntersectionObserverEntry>({
    alias: "appObserveIntersect",
  });
  private readonly triggers = {
    all: (entry: globalThis.IntersectionObserverEntry) => {
      this.intersect.emit(entry);
    },
    enter: (entry: globalThis.IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        this.intersect.emit(entry);
      }
    },
    exit: (entry: globalThis.IntersectionObserverEntry) => {
      if (!entry.isIntersecting) {
        this.intersect.emit(entry);
      }
    },
  };

  // [@]
  readonly disabled = input(false, {
    alias: "appObserveIntersectDisabled",
    transform: booleanAttribute,
  });

  // [@]
  readonly root = input<TOrNoValue<ElementRef<Element> | Element | Document>>(
    null,
    {
      alias: "appObserveIntersectRoot",
    }
  );

  // [@]
  readonly rootMargin = input<string>("200px 0px", {
    alias: "appObserveIntersectRootMargin",
  });

  // [@]
  readonly threshold = input<number | number[]>(0, {
    alias: "appObserveIntersectThreshold",
  });

  // [@]
  readonly emitWhen = input<"all" | "enter" | "exit">("enter", {
    alias: "appObserveIntersectEmitWhen",
  });

  // ## THRESHOLD/ROOTMARGIN SAFE DEFAULTS
  // #####################################
  // 1) General “is it on screen?” (UI toggles, start animations)
  //   { threshold: 0, rootMargin: '0px' }
  // 2) Lazy-load / prefetch (images, data, code-splitting)
  //   { threshold: 0, rootMargin: '200px 0px' }
  // 3) “Count it as viewed” (analytics, impression tracking)
  //   { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }
  // 4) Sticky headers / sections (trigger when it’s clearly inside viewport)
  //   { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
  // One-line default I’d ship for most “load when near viewport”
  //   { threshold: 0, rootMargin: '200px 0px' }
  // One-line default I’d ship for most “seen / active section”
  //   { threshold: 0.5, rootMargin: '0px 0px -10% 0px' }

  constructor() {
    effect((cleanup) => {
      // feature detect
      if (this.disabled() || !this.supported()) return;

      const r = this.root();
      const target = this.host.nativeElement;

      let observer_: TOrNoValue<IntersectionObserver> =
        new IntersectionObserver(
          (entries) => {
            this.$$.each(entries, this.triggers[this.emitWhen()]);
          },
          {
            root: (<any>r)?.nativeElement ?? (r || null),
            rootMargin: this.rootMargin(),
            threshold: this.threshold(),
          }
        );

      observer_.observe(target);

      cleanup(() => {
        observer_?.disconnect();
        observer_ = null;
      });
    });
  }
}
