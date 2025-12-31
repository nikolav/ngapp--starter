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
import { mergeMap, catchError } from "rxjs/operators";
import { toSignal } from "@angular/core/rxjs-interop";
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

  // @@
  readonly account = toSignal(user$$(this.$auth), { initialValue: null });
  // @@
  readonly access_token = signal<TOrNoValue<string>>(null);
  // @@
  readonly uid = computed(() => this.$$.get(this.account(), "uid", ""));
  // @@
  readonly email = computed(() => this.$$.get(this.account(), "email", ""));
  // @@
  readonly isAuth = computed(() => Boolean(this.uid()));
  protected prevAuth = this.isAuth();
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

  constructor() {
    // get api access_token
    effect(() => {
      // @!account clear
      if (!this.account()) {
        this.$s.clear("access_token");
        this.access_token.set(null);
        return;
      }
      this.$s.push({
        access_token: from(this.account()!.getIdToken())
          .pipe(
            mergeMap((idToken) =>
              this.$http.post(URL_AUTH_authenticate, { idToken })
            ),
            catchError((error) => {
              this.access_token.set(null);
              this.$$.onDebug({ "@error --authenticate": error });
              return this.$$.empty$$();
            })
          )
          .subscribe((res) => {
            try {
              this.access_token.set(schemaJwt.parse(this.$$.get(res, "token")));
            } catch (error) {
              // token invalid
              this.access_token.set(null);
              this.$$.onDebug({
                "@error --access-token --invalid": error,
              });
            }
          }),
      });
    });

    // emit:IEventApp @auth
    effect(() => {
      // @login
      if (!this.prevAuth && this.isAuth()) {
        this.$emitter.subject.next({
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: true,
        });
      } else if (this.prevAuth && !this.isAuth()) {
        // @logout
        this.$emitter.subject.next({
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: false,
        });
      }
      this.prevAuth = this.isAuth();
    });

    // ## profile:sync
    // @isAuthApi @QueryRef
    effect(() => {
      const q = this.profile._queryRef();
      if (!q) {
        this.$s.clear("profile");
        return;
      }
      this.$s.push({
        profile: q.valueChanges.subscribe((result) => {
          this.profile.data.set(
            this.$cache.data(result, this.profile._cacheKey())
          );
        }),
      });
    });
    // @isAuthApi
    //   get QueryRef
    effect(() => {
      if (!this.profile._cacheKey() || !this.isAuthApi()) {
        this.$s.clear("profileQueryRef");
        this.profile._queryRef.set(null);
        this.profile.data.set(null);
        return;
      }
      this.$s.push({
        profileQueryRef: this.$cache
          .key$$(this.profile._cacheKey())
          .pipe(catchError(() => this.$$.empty$$()))
          .subscribe((q) => {
            this.profile._queryRef.set(q);
          }),
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
    return from(signOut(this.$auth));
  }

  destroy() {
    this.$s.destroy();
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
}
