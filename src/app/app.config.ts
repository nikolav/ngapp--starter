import {
  inject,
  provideZoneChangeDetection,
  importProvidersFrom,
  // LOCALE_ID,
} from "@angular/core";
import type { ApplicationConfig } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  provideRouter,

  // use hash:/#/ location strategy
  // withHashLocation,

  // Use a route to pass information to components
  // #https://angular.dev/guide/routing/common-router-tasks#getting-route-information
  // withComponentInputBinding,
} from "@angular/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";

import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

// #https://valor-software.com/ng2-charts/
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
// import { chartsRegistrations_BASE } from "./config";

// #https://github.com/angular/angularfire/blob/main/docs/firestore.md
import { provideFirebaseApp } from "@angular/fire/app";
import { provideAuth as provideFirebaseAuth } from "@angular/fire/auth";
import { app as firebaseApp, auth as firebaseAuth } from "./config/firebase";

import { provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";

import { SocketIoModule } from "ngx-socket-io";

import { routes } from "./app.routes";

import {
  logRequestInterceptor,
  authRequestInterceptor,
} from "./middleware/interceptors";

import { TOKEN_foo } from "./keys";
import {
  MAT_DEFAULTS,
  ENDPOINT_GRAPHQL,
  configSocketIO,
  MAT_DAYJS_DATE_FORMATS,
} from "./config";

import {
  MAT_DATE_FORMATS,
  // MAT_DATE_LOCALE,
  // provideNativeDateAdapter,
} from "@angular/material/core";
import {
  provideMatDayjsAdapter,
  withDayjsAdapterOptions,
} from "./modules/providers/mat-dayjs-adapter";

export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: LOCALE_ID, useValue: "sr-RS" },

    importProvidersFrom(CommonModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),

    // ##routes
    provideRouter(routes),

    // ##http
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // interceptor --log-http
        logRequestInterceptor,
        // interceptor --set-auth-header
        authRequestInterceptor,
      ])
    ),

    // ##gql
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({
          uri: ENDPOINT_GRAPHQL,
        }),
        cache: new InMemoryCache(),
      };
    }),

    // ##io
    importProvidersFrom(SocketIoModule.forRoot(configSocketIO)),

    // ##firebase
    provideFirebaseApp(() => firebaseApp),
    provideFirebaseAuth(() => firebaseAuth),

    // ##charts
    provideCharts(withDefaultRegisterables()),

    // #provide:custom
    {
      provide: TOKEN_foo,
      useValue: "foobar",
    },

    // ##mat-datepicker
    // { provide: MAT_DATE_LOCALE, useValue: "sr-RS" },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_DATE_FORMATS },
    // provideNativeDateAdapter(),
    provideMatDayjsAdapter(withDayjsAdapterOptions({ useUtc: false })),

    // ##mat
    ...MAT_DEFAULTS,
  ],
};
//
