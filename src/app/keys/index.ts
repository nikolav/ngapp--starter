import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Subject } from "rxjs";

import type { IEventApp } from "../types";
import { StoreDataCache } from "../stores";
import { BreakpointsCustom } from "../assets/breakpoints";

export const TOKEN_localStorage = new InjectionToken<Storage>(
  "Storage:6090ec87-2fa3-514c-870f-2facbfb50ace",
  {
    providedIn: "root",
    factory: () => localStorage,
  }
);
export const TOKEN_isPlatformBrowser = new InjectionToken<boolean>(
  "fa04dacb-39e8-51bc-8188-dcbd2d3a16b2",
  {
    providedIn: "root",
    factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
  }
);
// export const TOKEN_google_maps = new InjectionToken<typeof google.maps | null>(
//   "google-maps:28c94fc1-e1b4-5f16-b19c-acbdfd16b87f",
//   {
//     providedIn: "root",
//     factory: () =>
//       inject(TOKEN_isPlatformBrowser)
//         ? (<any>inject(TOKEN_windowDefaultView)).google?.maps ?? null
//         : null,
//   }
// );
export const TOKEN_cacheDemo = new InjectionToken<StoreDataCache>(
  "cache:demo:55729762-a63f-5812-a58a-ab4b88b80dc9",
  {
    providedIn: "root",
    factory: () => new StoreDataCache().use({}),
  }
);
export const TOKEN_emitterDemo = new InjectionToken<Subject<unknown>>(
  "emitter:e815fdd6-6b5f-5c27-af2a-0ac900a7bf76",
  {
    providedIn: "root",
    factory: () => new Subject(),
  }
);
export const TOKEN_emitterNavigation = new InjectionToken<Subject<IEventApp>>(
  "emitter:navigation:2b57a0c1-bd62-5241-8a9d-7aec08f8a56c",
  {
    providedIn: "root",
    factory: () => new Subject<IEventApp>(),
  }
);

export const TOKEN_breakpoints = new InjectionToken<typeof BreakpointsCustom>(
  "BreakpointsCustom:437a48fe-da99-52e5-ae57-a35cf36a00a3",
  {
    providedIn: "root",
    factory: () => BreakpointsCustom,
  }
);
export const TOKEN_windowDefaultView = new InjectionToken<Window | null>(
  "Window:91418ac1-46ac-5b6d-8113-a6aa5344458f",
  {
    providedIn: "root",
    factory: () => inject(DOCUMENT).defaultView,
  }
);

// #
export { TOKEN_cachDom } from "./token-cach-dom";
