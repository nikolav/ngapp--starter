import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";

import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import {
  provideHttpClient,
  withFetch,
  // withInterceptorsFromDi,
} from "@angular/common/http";

import { AppConfigService, UseUtilsService, DatetimeService } from "./services";
import { StoreMain, StoreAuth, StoreGlobalVariable } from "./stores";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

//
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch()
      // withInterceptorsFromDi(),
    ),
    provideAnimationsAsync(),
    //
    UseUtilsService,
    DatetimeService,
    AppConfigService,
    StoreMain,
    StoreGlobalVariable,
    StoreAuth,
  ],
};
