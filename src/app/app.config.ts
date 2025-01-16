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

import { demoInterceptor } from "./middleware/interceptors";

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
      withFetch(),
      withInterceptors([
        // @demo
        demoInterceptor,
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
