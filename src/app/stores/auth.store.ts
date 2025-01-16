// #https://github.com/angular/angularfire/tree/main/docs
import {
  Injectable,
  OnDestroy,
  inject,
  computed,
  signal,
  effect,
  Injector,
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
import { filter as op_filter } from "rxjs/operators";

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
  EmitterService,
  AppConfigService,
} from "../services";
import { schemaJwt } from "../schemas";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  private injector = inject(Injector);

  private $auth = inject(Auth);
  private $$ = inject(UseUtilsService);
  private $ps = inject(UseProccessMonitorService);
  private $topics = inject(TopicsService);
  private $cache = inject(CacheService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);

  private user_s: TOrNoValue<Subscription>;
  private profile_s: TOrNoValue<Subscription>;
  private profile_q: TOrNoValue<QueryRef<IResultApolloCacheService>> = null;

  user$ = userObs(this.$auth);

  account = signal<TOrNoValue<IUser>>(null);
  profile = signal<any>(null);

  error = computed(() => this.$ps.error());
  processing = computed(() => this.$ps.processing());
  token = computed(() => this.$$.get(this.account(), "accessToken", ""));
  isAuth = computed(() => true === schemaJwt.safeParse(this.token()).success);
  uid = computed(() => this.$$.get(this.account(), "uid", ""));
  email = computed(() => this.$$.get(this.account(), "email", ""));
  isAdmin = computed(() => this.$$.get(this.profile(), "isAdmin", false));

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
    this.$emitter.subject
      .pipe(
        op_filter((event) => this.$config.events.EVENT_APP_MOUNTED === event)
      )
      .subscribe(() => {
        // @app:mounted
        //  sync profile from cache
        effect(
          () => {
            this.profile_s?.unsubscribe();
            const UID = this.uid();
            if (!UID) {
              return this.profile.set(null);
            }
            const cache_key = this.$topics.authProfile(UID);
            this.profile_q = this.$cache.key(cache_key);
            this.profile_s = this.profile_q?.valueChanges.subscribe(
              (result) => {
                this.profile.set(this.$cache.data(result, cache_key));
              }
            );
          },
          { injector: this.injector }
        );
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

  profilePatch(ppatch: any, merge = true) {
    const cache_key = this.$topics.authProfile(this.uid());
    return cache_key ? this.$cache.commit(cache_key, ppatch, merge) : undefined;
  }
  async profileReload() {
    return await this.profile_q?.refetch();
  }

  ngOnDestroy() {
    this.user_s?.unsubscribe();
    this.profile_s?.unsubscribe();
  }
}
