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
  withInterceptors,
  // withInterceptorsFromDi,
} from "@angular/common/http";

import { logRequestInterceptor } from "./middleware/interceptors";

import { provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache, ApolloLink } from "@apollo/client/core";
import { setContext as setContextApollo } from "@apollo/client/link/context";

// #https://github.com/angular/angularfire/blob/main/docs/firestore.md
import { provideFirebaseApp } from "@angular/fire/app";
import { provideFirestore } from "@angular/fire/firestore";
import { provideAuth as provideFirebaseAuth } from "@angular/fire/auth";
import { provideStorage as provideFirebaseStorage } from "@angular/fire/storage";
import {
  app as firebaseApp,
  db as firestore,
  auth as firebaseAuth,
  storage as firebaseStorage,
} from "./config/firebase";

import {
  AppConfigService,
  UseUtilsService,
  DatetimeService,
  EmitterService,
  LightboxService,
  TopicsService,
  CacheService,
} from "./services";
import {
  StoreMain,
  StoreAuth,
  StoreGlobalVariable,
  StoreAppProcessing,
} from "./stores";
import { AuthGuard, FooDeactivateGuard } from "./middleware/guards";

import { ENDPOINT_GRAPHQL, TOKEN_DEFAULT, IO_SERVER } from "./config";

const authApolo = setContextApollo((operation, context) => {
  try {
    return {
      headers: {
        Authorization: `Bearer ${TOKEN_DEFAULT}`,
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
      withFetch(),
      withInterceptors([
        // @interceptor:demo --log-http
        logRequestInterceptor,
      ])
      // withInterceptorsFromDi(),
    ),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: ApolloLink.from([
          authApolo,
          httpLink.create({
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
    TopicsService,
    CacheService,
    StoreAppProcessing,
    // #services:ui
    LightboxService,
    // ##guards
    AuthGuard,
    FooDeactivateGuard,
    // ##firebase
    provideFirebaseApp(() => firebaseApp),
    provideFirestore(() => firestore),
    provideFirebaseAuth(() => firebaseAuth),
    provideFirebaseStorage(() => firebaseStorage),
  ],
};
