// #https://github.com/angular/angularfire/tree/main/docs
import {
  Injectable,
  OnDestroy,
  inject,
  computed,
  signal,
  effect,
  // Injector,
} from "@angular/core";
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
import {
  // filter as op_filter,
  first as op_first,
} from "rxjs/operators";

import type {
  IAuthCreds,
  TOrNoValue,
  IResultApolloCacheService,
} from "../types";
import {
  UseUtilsService,
  UseProccessMonitorService,
  TopicsService,
  CacheService,
  // EmitterService,
  // AppConfigService,
} from "../services";
import { schemaJwt } from "../schemas";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  // private $injector = inject(Injector);
  private $auth = inject(Auth);
  private $io = inject(Socket);
  private $$ = inject(UseUtilsService);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  // private $config = inject(AppConfigService);
  // private $emitter = inject(EmitterService);
  private $ps = new UseProccessMonitorService();

  private profile_q: TOrNoValue<QueryRef<IResultApolloCacheService>> = null;

  private user_s: TOrNoValue<Subscription>;
  private profile_s: TOrNoValue<Subscription>;
  private profileIO_s: TOrNoValue<Subscription>;

  private user$ = userObs(this.$auth);

  // auth state
  account = signal<TOrNoValue<IUser>>(null);
  profile = signal<any>(null);

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
    // @profile:load-from-cache at app:init
    // this.$emitter.subject
    //   .pipe(
    //     op_filter((event) => this.$config.events.EVENT_APP_INIT === event),
    //     op_first()
    //   )
    //   .subscribe(() => {
    //     // @app:mounted
    //     //  profile --sync-start
    //     effect(
    //       () => {
    //         this.profile_s?.unsubscribe();
    //         const cache_key = this.profileCacheKey();
    //         if (!cache_key) return;
    //         this.profile_q = this.$cache.key(cache_key);
    //         this.profile_s = this.profile_q?.valueChanges.subscribe(
    //           (result) => {
    //             this.profile.set(this.$cache.data(result, cache_key));
    //           }
    //         );
    //       },
    //       { injector: this.$injector }
    //     );
    //   });
    // load profile on cache_key
    effect((onCleanup) => {
      let profile_cache_key = this.profileCacheKey();
      if (!profile_cache_key) {
        this.profile.set(null);
        return;
      }
      this.profile_q = this.$cache.key(profile_cache_key);
      this.profile_s = this.profile_q?.valueChanges.subscribe((result) => {
        this.profile.set(this.$cache.data(result, profile_cache_key));
      });
      onCleanup(() => {
        this.profile_s?.unsubscribe();
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
  }

  async authenticate(creds: IAuthCreds) {
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
      this.$ps.done();
    }
    if (!this.$ps.error())
      this.$ps.successful(() => {
        // @success --auth-login
      });
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
      });
    console.log("@debug --auth-logout", this.$ps.error());
  }

  async profilePatch(patch: any, merge = true) {
    const profile_cache_key = this.profileCacheKey();
    return new Promise((resolve, reject) =>
      profile_cache_key
        ? this.$cache
            .commit(profile_cache_key, patch, merge)
            ?.pipe(op_first())
            .subscribe(resolve)
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
  }
}
