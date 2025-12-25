import { InjectionToken } from "@angular/core";
import { Subject } from "rxjs";

import { DataCacheService } from "../stores/cache-data.service";

// @di tokens
export const TOKEN_foo = new InjectionToken<string>(
  "FOO:ed0d6051-4600-577d-af1f-e4844ce5b639"
);
export const TOKEN_localStorage = new InjectionToken<Storage>(
  "Storage:6090ec87-2fa3-514c-870f-2facbfb50ace",
  {
    providedIn: "root",
    factory: () => localStorage,
  }
);
// export const TOKEN_google_maps = new InjectionToken<typeof google.maps | null>(
//   "google-maps:28c94fc1-e1b4-5f16-b19c-acbdfd16b87f",
//   {
//     providedIn: "root",
//     factory: () => {
//       const platformId = inject(PLATFORM_ID);
//       return isPlatformBrowser(platformId) ? window.google?.maps ?? null : null;
//     },
//   }
// );
export const TOKEN_cache_demo = new InjectionToken<DataCacheService>(
  "cache:demo:55729762-a63f-5812-a58a-ab4b88b80dc9",
  {
    providedIn: "root",
    factory: () => new DataCacheService().use({}),
  }
);
export const TOKEN_emitter_demo = new InjectionToken<Subject<unknown>>(
  "emitter:e815fdd6-6b5f-5c27-af2a-0ac900a7bf76",
  {
    providedIn: "root",
    factory: () => new Subject(),
  }
);
