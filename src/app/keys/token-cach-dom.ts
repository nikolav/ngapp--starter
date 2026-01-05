import { InjectionToken, inject } from "@angular/core";
import { defer, from, EMPTY as EMPTY$, Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { TOKEN_isPlatformBrowser } from ".";

export type TCashDomClient = typeof import("cash-dom").default;

/**
 * Browser-only Cash DOM client
 * - Browser → emits once with Cash client
 * - Server  → EMPTY (no emission, no completion side-effects)
 */
export const TOKEN_cashDom = new InjectionToken<Observable<TCashDomClient>>(
  "cash-dom:bd2f5491-05db-5637-b241-e3bd669ed966",
  {
    providedIn: "root",
    factory: () => {
      const isBrowser = inject(TOKEN_isPlatformBrowser);
      return defer(() => {
        if (!isBrowser) {
          // SSR → no emit
          return EMPTY$;
        }

        // lazy-load in browser
        return from(
          import("cash-dom").then(
            (mod) => <TCashDomClient>(mod.default ?? <any>mod)
          )
        );
      }).pipe(
        // single lazy import, shared app-wide
        shareReplay({ bufferSize: 1, refCount: false })
      );
    },
  }
);
