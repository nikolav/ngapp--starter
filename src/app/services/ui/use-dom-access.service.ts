import { ElementRef, inject, Injectable, Renderer2 } from "@angular/core";

import { TOKEN_isPlatformBrowser } from "../../keys";
import type { THTMLElementLike } from "../../types";

@Injectable({
  providedIn: "root",
})
export class UseDomAccessService {
  // $
  private readonly $renderer = inject(Renderer2);
  private readonly $isPlatformBrowser = inject(TOKEN_isPlatformBrowser);

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
}
