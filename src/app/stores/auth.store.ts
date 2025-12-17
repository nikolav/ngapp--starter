// #https://github.com/angular/angularfire/tree/main/docs
import {
  Injectable,
  OnDestroy,
  inject,
  computed,
  signal,
  effect,
} from "@angular/core";
import { Subscription, mergeMap, from as oFrom, of as oOf } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
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

import { QueryRef } from "apollo-angular";
import { Socket } from "ngx-socket-io";

import type {
  IAuthCreds,
  TOrNoValue,
  IResultApolloCacheService,
  IEventApp,
} from "../types";
import {
  UseUtilsService,
  TopicsService,
  CacheService,
  EmitterService,
  AppConfigService,
  UseUniqueIdService,
} from "../services";
import { schemaJwt } from "../schemas";
import { URL_AUTH_authenticate } from "../config";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  // private $injector = inject(Injector);
  private $http = inject(HttpClient);
  private $auth = inject(Auth);
  private $io = inject(Socket);
  private $$ = inject(UseUtilsService);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);

  // update to run effect to signal app:logout
  private $uniqIdLogout = new UseUniqueIdService();

  private profile_q: TOrNoValue<QueryRef<IResultApolloCacheService>> = null;

  private user_s: TOrNoValue<Subscription>;
  private profile_s: TOrNoValue<Subscription>;
  private profileIO_s: TOrNoValue<Subscription>;
  private accessToken_s: TOrNoValue<Subscription>;

  private user$ = user$$(this.$auth);

  // auth state
  account = signal<TOrNoValue<IUser>>(null);
  profile = signal<any>(null);
  access_token = signal<any>(null);

  uid = computed(() => this.$$.get(this.account(), "uid", ""));
  email = computed(() => this.$$.get(this.account(), "email", ""));
  isAuth = computed(() => Boolean(this.uid()));
  isAdmin = computed(() => this.$$.get(this.profile(), "isAdmin", false));
  isAuthApi = computed(() => Boolean(this.access_token()));
  profileCacheKey = computed(() => this.$topics.authProfile(this.uid()));

  profileIO = computed(() =>
    this.profileCacheKey()
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(this.profileCacheKey()))
      : undefined
  );

  debug = computed(() =>
    this.$$.dumpJson({
      account: this.account(),
      profile: this.profile(),
      access_token: this.access_token(),
    })
  );

  constructor() {
    this.user_s = this.user$.subscribe((user) => {
      this.account.set(user);
    });
    // get api access_token
    effect((onCleanup) => {
      this.accessToken_s = oFrom(
        this.account() ? this.account()!.getIdToken() : Promise.reject()
      )
        .pipe(
          catchError(() => oOf(null)),
          mergeMap((idToken) => {
            return idToken
              ? this.$http.post(URL_AUTH_authenticate, { idToken })
              : this.$$.error$$();
          })
        )
        .pipe(catchError(() => oOf(null)))
        .subscribe((res) => {
          try {
            this.access_token.set(schemaJwt.parse(this.$$.get(res, "token")));
          } catch (error) {
            // token invalid; ignore
          }
        });
      onCleanup(() => {
        this.accessToken_s?.unsubscribe();
        this.access_token.set(null);
      });
    });
    // load profile on cache_key
    effect((onCleanup) => {
      if (!this.profileCacheKey() || !this.isAuthApi()) return;
      this.profile_q = this.$cache.key(this.profileCacheKey());
      this.profile_s = this.profile_q!.valueChanges.subscribe((result) => {
        this.profile.set(this.$cache.data(result, this.profileCacheKey()));
      });
      onCleanup(() => {
        this.profile_s?.unsubscribe();
        this.profile.set(null);
      });
    });
    // reload profile on io
    effect((onCleanup) => {
      const io = this.profileIO();
      if (!io) return;
      this.profileIO_s = io
        .pipe(
          mergeMap(() => this.profileReload()),
          catchError(() => oOf(null))
        )
        .subscribe();
      onCleanup(() => {
        this.profileIO_s?.unsubscribe();
      });
    });
    // emit:IEventApp @auth
    effect(() => {
      if (this.isAuth()) {
        this.$emitter.subject.next(<IEventApp>{
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: true,
        });
        return;
      }
      // @logout()
      if (!this.isAuth() && this.$uniqIdLogout.ID()) {
        this.$emitter.subject.next(<IEventApp>{
          type: this.$config.events.EVENT_TYPE_AUTH,
          payload: false,
        });
      }
    });
  }

  authenticate(creds: IAuthCreds) {
    return oFrom(
      signInWithEmailAndPassword(this.$auth, creds.email, creds.password)
    );
  }
  register(creds: IAuthCreds) {
    return oFrom(
      createUserWithEmailAndPassword(this.$auth, creds.email, creds.password)
    );
  }
  logout() {
    return oFrom(signOut(this.$auth));
  }
  profilePatch(patch: any, merge = true) {
    return this.$cache.commit(this.profileCacheKey(), patch, merge);
  }
  profileReload() {
    return oFrom(this.profile_q ? this.profile_q.refetch() : Promise.reject());
  }
  ngOnDestroy() {
    this.user_s?.unsubscribe();
    this.profile_s?.unsubscribe();
    this.profileIO_s?.unsubscribe();
    this.accessToken_s?.unsubscribe();
  }
}
