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
import { from, Subject } from "rxjs";
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

import type { IAuthCreds, TOrNoValue } from "../types";
import { UseUtilsService, ManageSubscriptionsService } from "../services";
import { schemaJwt } from "../schemas";
import { URL_AUTH_authenticate } from "../config";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  private $http = inject(HttpClient);
  private $auth = inject(Auth);

  private $$ = inject(UseUtilsService);
  private $subs = new ManageSubscriptionsService();

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
  // @@
  readonly isAuthApi = computed(() => Boolean(this.access_token()));
  // @@
  readonly login$ = new Subject<void>();
  // @@
  readonly logout$ = new Subject<void>();

  private prevAuth = this.isAuth();

  constructor() {
    // get api access_token
    effect(() => {
      // @!account clear
      if (!this.account()) {
        this.$subs.clear("access_token");
        this.access_token.set(null);
        return;
      }
      this.$subs.push({
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
      if (!this.prevAuth && this.isAuth()) {
        this.login$.next();
      } else if (this.prevAuth && !this.isAuth()) {
        this.logout$.next();
      }
      this.prevAuth = this.isAuth();
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
    this.$subs.destroy();
  }
  //
  ngOnDestroy() {
    this.destroy();
  }
}
