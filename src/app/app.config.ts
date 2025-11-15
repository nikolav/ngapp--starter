import {
  type ApplicationConfig,
  inject,
  provideZoneChangeDetection,
  importProvidersFrom,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  provideRouter,
  // use hash:/#/ location strategy
  // withHashLocation,

  // Use a route to pass information to components
  // #https://angular.dev/guide/routing/common-router-tasks#getting-route-information
  // withComponentInputBinding,
} from "@angular/router";
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
} from "@angular/common/http";

// #https://valor-software.com/ng2-charts/
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
// import { chartsRegistrations_BASE } from "./config";

import {
  logRequestInterceptor,
  authRequestInterceptor,
} from "./middleware/interceptors";

import { provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";

// #https://github.com/angular/angularfire/blob/main/docs/firestore.md
import { provideFirebaseApp } from "@angular/fire/app";
import { provideAuth as provideFirebaseAuth } from "@angular/fire/auth";
import { app as firebaseApp, auth as firebaseAuth } from "./config/firebase";

import { ENDPOINT_GRAPHQL, configSocketIO } from "./config";
import { SocketIoModule } from "ngx-socket-io";

import { TOKEN_foo } from "./keys";
import { MAT_OPIONS } from "./config";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // interceptor --log-http
        logRequestInterceptor,
        // interceptor --set-auth-header
        authRequestInterceptor,
      ])
    ),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({
          uri: ENDPOINT_GRAPHQL,
        }),
        cache: new InMemoryCache(),
      };
    }),
    importProvidersFrom(SocketIoModule.forRoot(configSocketIO)),
    // ##firebase
    provideFirebaseApp(() => firebaseApp),
    provideFirebaseAuth(() => firebaseAuth),
    // #provide:custom
    {
      provide: TOKEN_foo,
      useValue: "foobar",
    },
    provideCharts(withDefaultRegisterables()),
    // provideCharts({ registerables: [...chartsRegistrations_BASE] }),
    ...MAT_OPIONS,
  ],
};
