// #https://github.com/angular/angularfire/tree/main/docs
import {
  Injectable,
  OnDestroy,
  inject,
  computed,
  signal,
  effect,
  // Injector,
  untracked,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  // sign-in, sign-out, token observables
  // #https://github.com/angular/angularfire/blob/main/docs/auth.md#convenience-observables
  user as userObs,
  // idToken as idTokenObs,
  type User as IUser,
  type UserCredential as IUserCredential,
} from "@angular/fire/auth";
import { QueryRef } from "apollo-angular";
import { Subscription } from "rxjs";
import { Socket } from "ngx-socket-io";

import type {
  IAuthCreds,
  TOrNoValue,
  IResultApolloCacheService,
  IEventApp,
} from "../types";
import {
  UseUtilsService,
  UseProccessMonitorService,
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
  private $ps = new UseProccessMonitorService();

  // update to run effect to signal app:logout
  private $uniqIdLogout = new UseUniqueIdService();

  private profile_q: TOrNoValue<QueryRef<IResultApolloCacheService>> = null;

  private user_s: TOrNoValue<Subscription>;
  private profile_s: TOrNoValue<Subscription>;
  private profileIO_s: TOrNoValue<Subscription>;
  private accessToken_s: TOrNoValue<Subscription>;

  private user$ = userObs(this.$auth);

  // auth state
  account = signal<TOrNoValue<IUser>>(null);
  profile = signal<any>(null);
  access_token = signal<any>(null);

  error = computed(() => this.$ps.error());
  processing = computed(() => this.$ps.processing());
  token = computed(() => this.$$.get(this.account(), "accessToken", ""));
  isAuth = computed(() => schemaJwt.safeParse(this.token()).success);
  uid = computed(() => this.$$.get(this.account(), "uid", ""));
  email = computed(() => this.$$.get(this.account(), "email", ""));
  isAdmin = computed(() => this.$$.get(this.profile(), "isAdmin", false));
  profileCacheKey = computed(() => this.$topics.authProfile(this.uid()));

  profileIO = computed(() => {
    const cache_key = this.profileCacheKey();
    return cache_key
      ? this.$io.fromEvent(this.$topics.ioEventOnCache(cache_key))
      : undefined;
  });

  debug = computed(() =>
    this.$$.dumpJson({
      isAuth: this.isAuth(),
      isAdmin: this.isAdmin(),
      token: this.token(),
      uid: this.uid(),
      email: this.email(),
      account: this.account(),
      profile: this.profile(),
    })
  );

  constructor() {
    this.user_s = this.user$.subscribe((user) => {
      this.account.set(user);
    });
    // load profile on cache_key
    effect((onCleanup) => {
      let profile_cache_key = this.profileCacheKey();
      if (!profile_cache_key) return;
      this.profile_q = this.$cache.key(profile_cache_key);
      this.profile_s = this.profile_q?.valueChanges.subscribe((result) => {
        this.profile.set(this.$cache.data(result, profile_cache_key));
      });
      onCleanup(() => {
        this.profile_s?.unsubscribe();
        this.profile.set(null);
      });
    });
    // reload profile on io
    effect((onCleanup) => {
      if (this.profileCacheKey()) {
        this.profileIO_s = this.profileIO()!.subscribe(() =>
          this.profileReload()
        );
      }
      onCleanup(() => {
        this.profileIO_s?.unsubscribe();
      });
    });
    // get api access_token
    effect((onCleanup) => {
      (async () => {
        const idToken = await this.account()?.getIdToken();
        if (!idToken) return;
        untracked(() => {
          this.accessToken_s = this.$http
            .post(URL_AUTH_authenticate, { idToken })
            .subscribe((res) => {
              const token = this.$$.get(res, "token");
              if (!token) return;
              this.access_token.set(token);
            });
        });
      })();
      onCleanup(() => {
        this.accessToken_s?.unsubscribe();
        this.access_token.set(null);
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

  async authenticate(creds: IAuthCreds, onError: any = this.$$.noop) {
    let res: TOrNoValue<IUserCredential>;
    try {
      this.$ps.begin();
      res = await signInWithEmailAndPassword(
        this.$auth,
        creds.email,
        creds.password
      );
    } catch (error) {
      this.$ps.setError(error);
    } finally {
      setTimeout(() => {
        this.$ps.done();
      });
    }
    if (!this.$ps.error()) {
      this.$ps.successful(() => {
        // @success --auth-login
        // pass
      });
    } else {
      onError(this.$ps.error());
    }
    console.log("@debug --auth-login", this.$ps.error());
    return res;
  }
  async register(creds: IAuthCreds) {
    let res: TOrNoValue<IUserCredential>;
    try {
      this.$ps.begin();
      res = await createUserWithEmailAndPassword(
        this.$auth,
        creds.email,
        creds.password
      );
    } catch (error) {
      this.$ps.setError(error);
    } finally {
      this.$ps.done();
    }
    if (!this.$ps.error())
      this.$ps.successful(() => {
        // @success --auth-register
      });
    console.log("@debug --auth-register", this.$ps.error());
    return res;
  }
  async logout() {
    try {
      this.$ps.begin();
      await signOut(this.$auth);
    } catch (error) {
      this.$ps.setError(error);
    } finally {
      this.$ps.done();
    }
    if (!this.$ps.error())
      this.$ps.successful(() => {
        // @success --auth-logout
        this.$uniqIdLogout.next();
      });
    console.log("@debug --auth-logout", this.$ps.error());
  }

  async profilePatch(patch: any, merge = true) {
    const profile_cache_key = this.profileCacheKey();
    return new Promise((resolve, reject) =>
      profile_cache_key
        ? this.$cache
            .commit(profile_cache_key, patch, merge)
            ?.subscribe(resolve)
        : reject(null)
    );
  }
  async profileReload() {
    return await this.profile_q?.refetch();
  }

  ngOnDestroy() {
    this.user_s?.unsubscribe();
    this.profile_s?.unsubscribe();
    this.profileIO_s?.unsubscribe();
    this.accessToken_s?.unsubscribe();
  }
}
