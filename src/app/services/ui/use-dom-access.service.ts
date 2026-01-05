import { ElementRef, inject, Injectable, Renderer2 } from "@angular/core";
import { map } from "rxjs/operators";

import { TOKEN_cachDom, TOKEN_isPlatformBrowser } from "../../keys";
import type {
  TCashDomSelector,
  THTMLElementLike,
  TOrNoValue,
} from "../../types";
import { UseUtilsService } from "../utils";

@Injectable({
  providedIn: "root",
})
export class UseDomAccessService {
  // $
  private readonly $renderer = inject(Renderer2);
  private readonly $isPlatformBrowser = inject(TOKEN_isPlatformBrowser);
  private readonly $cd = inject(TOKEN_cachDom);

  // $$
  private readonly $$ = inject(UseUtilsService);

  //
  unwrapElement<T extends HTMLElement = HTMLElement>(
    node: THTMLElementLike<T>
  ) {
    if (node instanceof ElementRef) {
      return node.nativeElement;
    }

    if ("nativeElement" in node) {
      return node.nativeElement;
    }

    return node;
  }
  class = {
    ls: (sel: TCashDomSelector) =>
      this.$cd.pipe(map((c) => Array.from(c(sel).get(0)?.classList ?? []))),
    push: (sel: TCashDomSelector, cls: Record<string, TOrNoValue<boolean>>) =>
      this.$cd.pipe(
        map((c) => {
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
      this.$cd.pipe(map((c) => c(sel).hasClass(cls))),
  };
}
