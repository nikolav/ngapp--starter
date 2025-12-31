// #https://github.com/angular/angularfire/tree/main/docs
import {
  Injectable,
  OnDestroy,
  inject,
  computed,
  signal,
  effect,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { from } from "rxjs";
import { mergeMap, catchError, filter, tap } from "rxjs/operators";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// sign-in, sign-out, token observables
// #https://github.com/angular/angularfire/blob/main/docs/auth.md#convenience-observables
import {
  Auth,
  user as user$$,
  type User as IUser,
  // type UserCredential as IUserCredential,
} from "@angular/fire/auth";
import { Socket } from "ngx-socket-io";
import type { QueryRef } from "apollo-angular";

import type {
  IAuthCreds,
  TOrNoValue,
  IResultApolloCacheService,
  TRecordJson,
} from "../types";
import {
  UseUtilsService,
  TopicsService,
  EmitterService,
  AppConfigService,
  UseUniqueIdService,
  ManageSubscriptionsService,
  CacheService,
} from "../services";
import { schemaJwt } from "../schemas";
import { URL_AUTH_authenticate } from "../config";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  protected $http = inject(HttpClient);
  protected $io = inject(Socket);
  protected $auth = inject(Auth);

  protected $$ = inject(UseUtilsService);
  protected $config = inject(AppConfigService);
  protected $topics = inject(TopicsService);
  protected $emitter = inject(EmitterService);
  protected $cache = inject(CacheService);

  protected $s = new ManageSubscriptionsService();
  // update to run effect to signal app:logout
  protected $uniqIdLogout = new UseUniqueIdService();

  // @@
  readonly account = signal<TOrNoValue<IUser>>(null);
  // @@
  readonly access_token = signal<TOrNoValue<string>>(null);
  // @@
  readonly uid = computed(() => this.$$.get(this.account(), "uid", ""));
  // @@
  readonly email = computed(() => this.$$.get(this.account(), "email", ""));
  // @@
  readonly isAuth = computed(() => Boolean(this.uid()));
  // @@
  readonly isAuthApi = computed(() => Boolean(this.access_token()));

  // @@
  readonly profile = {
    _cacheKey: computed(() => this.$topics.authProfile(this.uid())),
    _queryRef: signal<TOrNoValue<QueryRef<IResultApolloCacheService>>>(null),
    _io: () => {
      return this.profile._cacheKey()
        ? this.$io.fromEvent(
            this.$topics.ioEventOnCache(this.profile._cacheKey())
          )
        : this.$$.error$$();
    },

    // @@
    data: signal<any>(null),

    // @@
    reload: () => {
      return this.profile._queryRef()
        ? from(this.profile._queryRef()!.refetch())
        : this.$$.error$$();
    },

    // @@
    commit: (patch: TOrNoValue<TRecordJson>, MERGE = true) => {
      return this.$cache.commit(this.profile._cacheKey(), patch, MERGE);
    },
  };

  protected user$ = user$$(this.$auth);

  constructor() {
    // sync account:IUser
    this.$s.push({
      account: this.user$.subscribe((user) => {
        this.account.set(user);
      }),
    });

    // get api access_token
    effect(() => {
      this.$s.push({
        access_token: from(
          this.account() ? this.account()!.getIdToken() : Promise.reject()
        )
          .pipe(
            mergeMap((idToken) => {
              return idToken
                ? this.$http.post(URL_AUTH_authenticate, { idToken })
                : this.$$.error$$();
            }),
            catchError(() => this.$$.empty$$())
          )
          .pipe(
            catchError((error) => {
              this.$$.onDebug({ "@error --access-token": error });
              return this.$$.empty$$();
            })
          )
          .subscribe((res) => {
            try {
              this.access_token.set(schemaJwt.parse(this.$$.get(res, "token")));
            } catch (error) {
              // token invalid
              this.$$.onDebug({
                "@error --api --access-token --invalid": error,
              });
            }
          }),
      });
    });

    // @logout clear access_token
    this.$s.push({
      access_token_onLogout_clear: this.$emitter.subject
        .pipe(
          // filter logout events
          filter(
            (event) =>
              this.$config.events.EVENT_TYPE_AUTH === event.type &&
              false === event.payload
          )
        )
        .subscribe((_eventOnLogout) => {
          this.access_token.set(null);
        }),
    });

    // emit:IEventApp @auth
    effect(() => {
      // @login
      if (this.isAuth()) {
        this.$emitter.subject.next({
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: true,
        });
        return;
      }
      // @logout
      if (!this.isAuth() && this.$uniqIdLogout.ID()) {
        this.$emitter.subject.next({
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: false,
        });
      }
    });

    // ## profile:sync
    // @isAuthApi @QueryRef
    effect(() => {
      this.$s.push({
        profile: this.profile._queryRef()?.valueChanges.subscribe((result) => {
          this.profile.data.set(
            this.$cache.data(result, this.profile._cacheKey())
          );
        }),
      });
    });
    // @isAuthApi
    //   get QueryRef
    effect((cleanup) => {
      if (!this.profile._cacheKey() || !this.isAuthApi()) return;
      this.$s.push({
        profileQueryRef: this.$cache
          .key$$(this.profile._cacheKey())
          .pipe(catchError(() => this.$$.empty$$()))
          .subscribe((qr) => {
            this.profile._queryRef.set(qr);
          }),
      });
      cleanup(() => {
        this.profile.data.set(null);
      });
    });

    // @profile:io sync
    effect(() => {
      this.$s.push({
        profile_io: this.profile
          ._io()
          .pipe(
            mergeMap(() => this.profile.reload()),
            catchError(() => this.$$.empty$$())
          )
          .subscribe(),
      });
    });
  }

  // @@
  authenticate(creds: IAuthCreds) {
    return from(
      signInWithEmailAndPassword(this.$auth, creds.email, creds.password)
    );
  }

  // @@
  register(creds: IAuthCreds) {
    return from(
      createUserWithEmailAndPassword(this.$auth, creds.email, creds.password)
    );
  }

  // @@
  logout() {
    return from(signOut(this.$auth)).pipe(
      tap(() => {
        this.$uniqIdLogout.next();
      })
    );
  }

  destroy() {
    this.$s.destroy();
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
}
