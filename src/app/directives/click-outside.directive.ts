import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  Renderer2,
  DestroyRef,
  input,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { UseUtilsService } from "../services";
import { TOrNoValue } from "../types";

type ClickOutsideIgnorable = string | Element | ElementRef<Element>;

@Directive({
  selector: "[appClickOutside]",
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private readonly $$ = inject(UseUtilsService);
  /** input callback function to call (clickOutside) */
  appClickOutside = input<TOrNoValue<() => void>>(null);
  /** Temporarily disable the outside detection */
  appClickOutsideDisabled = input(false);
  /** Elements or selectors to ignore */
  appClickOutsideIgnore = input<ClickOutsideIgnorable[]>([]);

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);

  private detach?: () => void;

  ngOnInit(): void {
    // Renderer2 keeps this SSR/platform-safe.
    this.detach = this.renderer.listen(
      this.doc,
      "pointerdown",
      (event: Event) => {
        if (this.appClickOutsideDisabled()) return;

        const callback = this.appClickOutside();
        if (null == callback) return;

        const host = this.elRef.nativeElement;
        const target = <Node | null>event.target;

        // If event has a composedPath (Shadow DOM), prefer that.
        const path: EventTarget[] | null =
          typeof (<any>event).composedPath === "function"
            ? (<any>event).composedPath()
            : null;

        const isInHost = path
          ? path.includes(host)
          : !!(target && host.contains(target));

        if (isInHost) return;

        // Ignore configured areas
        if (this.isInIgnoredArea(path, target)) return;

        callback();
      }
    );

    // Auto-cleanup on destroy even if someone forgets to call ngOnDestroy
    this.destroyRef.onDestroy(() => this.detach?.());
  }

  ngOnDestroy(): void {
    this.detach?.();
  }

  private isInIgnoredArea(
    path: EventTarget[] | null,
    target: Node | null
  ): boolean {
    if (this.$$.isEmpty(this.appClickOutsideIgnore())) return false;

    const doc = <Document>this.doc;

    const toElement = (i: ClickOutsideIgnorable): Element | null => {
      if (typeof i === "string") return doc.querySelector(i);
      if ((<ElementRef>i).nativeElement) return (<ElementRef>i).nativeElement;
      return <Element>i;
    };

    const candidates = this.appClickOutsideIgnore()
      .map(toElement)
      .filter((e): e is Element => !!e);

    if (path) return candidates.some((e) => path.includes(e));
    return !!(target && candidates.some((e) => e.contains(target)));
  }
}
