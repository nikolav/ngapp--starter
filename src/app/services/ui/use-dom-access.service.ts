import {
  ElementRef,
  inject,
  Injectable,
  // Renderer2,
} from "@angular/core";
import { map, tap } from "rxjs/operators";

import {
  TOKEN_cashDom,
  TOKEN_isSupported_getBoundingClientRect,
  // TOKEN_isPlatformBrowser,
} from "../../keys";
import { UseUtilsService } from "../utils";
import type {
  IElementMeasurement,
  TCashDomCash,
  TCashDomContext,
  TCashDomSelector,
  THTMLElementLike,
  TOrNoValue,
} from "../../types";

@Injectable({
  providedIn: "root",
})
export class UseDomAccessService {
  // $
  // private readonly $renderer = inject(Renderer2);
  // private readonly $isPlatformBrowser = inject(TOKEN_isPlatformBrowser);
  readonly $d = inject(TOKEN_cashDom);

  // $$
  private readonly $$ = inject(UseUtilsService);

  // .
  readonly supported = {
    getBoundingClientRect: inject(TOKEN_isSupported_getBoundingClientRect),
  };

  // @
  ngUnwrapElement = <T extends HTMLElement = HTMLElement>(
    node: THTMLElementLike<T>
  ) => {
    if (node instanceof ElementRef) {
      return node.nativeElement;
    }

    if ("nativeElement" in node) {
      return node.nativeElement;
    }

    return node;
  };

  // @
  access = (sel?: TCashDomSelector, ctx?: TCashDomContext | TCashDomCash) =>
    this.$d.pipe(map(($c) => $c(sel, ctx)));

  // @
  class = {
    ls: (sel: TCashDomSelector) =>
      this.$d.pipe(map((c) => Array.from(c(sel).get(0)?.classList ?? []))),
    push: (sel: TCashDomSelector, cls: Record<string, TOrNoValue<boolean>>) =>
      this.$d.pipe(
        tap((c) => {
          this.$$.each(cls, (value, classNames) => {
            const col = c(sel);
            if (null != value) {
              // set/unset
              col.toggleClass(classNames, value);
            } else {
              // toggle
              col.toggleClass(classNames);
            }
          });
        })
      ),
    has: (sel: TCashDomSelector, cls: string) =>
      this.$d.pipe(map((c) => c(sel).hasClass(cls))),
  };

  // @
  isSvgElement(el: TOrNoValue<globalThis.Element>) {
    return el
      ? "string" === typeof el.namespaceURI &&
          el.namespaceURI.toLowerCase().includes("svg")
      : false;
  }

  // @
  sizeFromResizeObserverEntry(
    entry: globalThis.ResizeObserverEntry,
    box: globalThis.ResizeObserverBoxOptions = "border-box"
  ) {
    // SVG: use getBoundingClientRect() when in browser
    if (
      this.isSvgElement(entry.target) &&
      this.supported.getBoundingClientRect
    ) {
      const r = entry.target.getBoundingClientRect();
      return {
        width: r.width,
        height: r.height,
      };
    }

    // Pick the boxSize field based on `box`
    const boxSize =
      box === "border-box"
        ? entry.borderBoxSize
        : box === "content-box"
        ? entry.contentBoxSize
        : entry.devicePixelContentBoxSize;

    // If boxSize exists, it can be either a single object or an array (browser-dependent)
    if (boxSize) {
      const sizes: globalThis.ResizeObserverSize[] = Array.isArray(boxSize)
        ? boxSize
        : [boxSize];

      const width = sizes.reduce((acc, s) => acc + (s.inlineSize || 0), 0);
      const height = sizes.reduce((acc, s) => acc + (s.blockSize || 0), 0);

      return { width, height };
    }

    // Fallback: contentRect (older / more widely supported)
    if (entry.contentRect) {
      return {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
    }

    // Ultimate fallback (should rarely happen)
    return { width: 0, height: 0 };
  }

  measureElement = {
    //
    "border-box": (target: Element) => {
      const m = <IElementMeasurement>{
        width: undefined,
        height: undefined,
        rect: undefined,
      };

      try {
        const r = target.getBoundingClientRect();

        const w = Math.max(0, r.width);
        const h = Math.max(0, r.height);

        m.width = w;
        m.height = h;
        // border-box rect (includes padding + border)
        // x/y are 0 here because storing "size" semantics, not viewport position
        m.rect = new DOMRectReadOnly(0, 0, w, h);
      } catch (error) {
        this.$$.onDebug({ "UseDomAccessService:measureElement": error });
      }

      return m;
    },
    //
    "content-box": (target: Element) => {
      const m = <IElementMeasurement>{
        width: undefined,
        height: undefined,
        rect: undefined,
      };

      try {
        const cs = getComputedStyle(target);

        const padx = px(cs.paddingLeft) + px(cs.paddingRight);
        const pady = px(cs.paddingTop) + px(cs.paddingBottom);
        const bx = px(cs.borderLeftWidth) + px(cs.borderRightWidth);
        const by = px(cs.borderTopWidth) + px(cs.borderBottomWidth);

        const r = target.getBoundingClientRect();

        const w = Math.max(0, r.width - padx - bx);
        const h = Math.max(0, r.height - pady - by);

        m.width = w;
        m.height = h;
        // Create a DOMRectReadOnly-like object
        m.rect = new DOMRectReadOnly(0, 0, w, h);
      } catch (error) {
        this.$$.onDebug({ "UseDomAccess:measureElement": error });
      }
      //
      return m;
    },
    "device-pixel-content-box": (target: Element) => {
      const m = <IElementMeasurement>{
        width: undefined,
        height: undefined,
        rect: undefined,
      };

      try {
        const cs = getComputedStyle(target);

        const padx = px(cs.paddingLeft) + px(cs.paddingRight);
        const pady = px(cs.paddingTop) + px(cs.paddingBottom);
        const bx = px(cs.borderLeftWidth) + px(cs.borderRightWidth);
        const by = px(cs.borderTopWidth) + px(cs.borderBottomWidth);

        const r = target.getBoundingClientRect();

        // CSS pixels (content-box)
        const cssw = Math.max(0, r.width - padx - bx);
        const cssh = Math.max(0, r.height - pady - by);

        // Device pixels
        const dpr = globalThis.devicePixelRatio ?? 1;
        const w = Math.max(0, Math.round(cssw * dpr));
        const h = Math.max(0, Math.round(cssh * dpr));

        m.width = w;
        m.height = h;
        // Store "rect" as numbers in device px (x/y kept 0 because it's size semantics)
        m.rect = new DOMRectReadOnly(0, 0, w, h);
      } catch (error) {
        this.$$.onDebug({ "UseDomAccess:measureElement": error });
      }
      //
      return m;
    },
  };
}

// --utils
function px(v: string) {
  return v ? parseFloat(v) || 0 : 0;
}
