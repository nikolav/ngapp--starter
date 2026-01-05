import { InjectionToken, inject } from "@angular/core";
import {
  defer,
  from,
  EMPTY as EMPTY$,
  shareReplay,
  type Observable,
} from "rxjs";
import { TOKEN_isPlatformBrowser } from ".";

export type TCashDomClient = typeof import("cash-dom").default;

/**
 * Browser-only Cash DOM client
 * - Browser → emits once with Cash client
 * - Server  → EMPTY (no emission, no completion side-effects)
 */
export const TOKEN_cachDom = new InjectionToken<Observable<TCashDomClient>>(
  "cash-dom:bd2f5491-05db-5637-b241-e3bd669ed966",
  {
    providedIn: "root",
    factory: () =>
      defer(() => {
        if (!inject(TOKEN_isPlatformBrowser)) {
          // 🚫 SSR → no emit
          return EMPTY$;
        }

        // lazy-load cash-dom only in browser
        return from(
          import("cash-dom").then(
            (m) => (m.default ?? (m as any)) as TCashDomClient
          )
        );
      }).pipe(
        // single lazy import, shared app-wide
        shareReplay({ bufferSize: 1, refCount: false })
      ),
  }
);
