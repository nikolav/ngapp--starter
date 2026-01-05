import {
  ElementRef,
  inject,
  Injectable,
  // Renderer2,
} from "@angular/core";
import { map } from "rxjs/operators";

import {
  TOKEN_cashDom,
  // TOKEN_isPlatformBrowser,
} from "../../keys";
import { UseUtilsService } from "../utils";
import type {
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
  private readonly $cd = inject(TOKEN_cashDom);

  // $$
  private readonly $$ = inject(UseUtilsService);

  // @
  ngUnwrapElement<T extends HTMLElement = HTMLElement>(
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

  // @
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
