import {
  inject,
  ApplicationConfig,
  provideZoneChangeDetection,
  // importProvidersFrom,
} from "@angular/core";

import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import {
  provideHttpClient,
  withFetch,
  // withInterceptorsFromDi,
} from "@angular/common/http";

import { provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache, ApolloLink } from "@apollo/client/core";
import { setContext as setContextApollo } from "@apollo/client/link/context";

import {
  AppConfigService,
  UseUtilsService,
  DatetimeService,
  EmitterService,
} from "./services";
import { StoreMain, StoreAuth, StoreGlobalVariable } from "./stores";
import { AuthGuard, FooDeactivateGuard } from "./middleware/guards";

import { ENDPOINT_GRAPHQL, KEY_ACCESS_TOKEN } from "./config";

const authApolo = setContextApollo((operation, context) => {
  try {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(KEY_ACCESS_TOKEN)}`,
      },
    };
  } catch (error) {
    // pass
  }

  return {};
});

//
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch()
      // withInterceptorsFromDi(),
    ),
    //
    // provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: ApolloLink.from([
          authApolo,
          httpLink.create({
            // uri: "<%= endpoint %>",
            uri: ENDPOINT_GRAPHQL,
          }),
        ]),
        cache: new InMemoryCache(),
      };
    }),
    // ##services
    UseUtilsService,
    DatetimeService,
    AppConfigService,
    EmitterService,
    StoreMain,
    StoreGlobalVariable,
    StoreAuth,
    // ##guards
    AuthGuard,
    FooDeactivateGuard,
    //
  ],
};
