import { Injectable, OnDestroy, inject, computed, signal } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  // user observable streams events triggered by sign-in, sign-out, and token refresh events
  // #https://github.com/angular/angularfire/blob/main/docs/auth.md#convenience-observables
  user as userObs,
  // idToken as idTokenObs,
  type User as IUser,
  type UserCredential as IUserCredential,
} from "@angular/fire/auth";
import { Subscription } from "rxjs";

import type { IAuthCreds, TOrNoValue } from "../types";
import { UseUtilsService, UseProccessMonitorService } from "../services";
import { schemaJwt } from "../schemas";

@Injectable({
  providedIn: "root",
})
export class StoreAuth implements OnDestroy {
  private _auth = inject(Auth);
  private $$ = inject(UseUtilsService);
  private $ps = inject(UseProccessMonitorService);

  private subscriptionUser: TOrNoValue<Subscription>;

  user$ = userObs(this._auth);

  account = signal<TOrNoValue<IUser>>(null);
  profile = signal<any>(null);

  error = computed(() => this.$ps.error());
  processing = computed(() => this.$ps.processing());
  accessToken = computed(() => this.$$.get(this.account(), "accessToken", ""));
  isAuth = computed(
    () => true === schemaJwt.safeParse(this.accessToken()).success
  );
  uid = computed(() => this.$$.get(this.account(), "uid"));

  constructor() {
    this.subscriptionUser = this.user$.subscribe((user) => {
      this.account.set(user);
    });
  }

  async authenticate(creds: IAuthCreds) {
    let res: TOrNoValue<IUserCredential>;
    try {
      this.$ps.begin();
      res = await signInWithEmailAndPassword(
        this._auth,
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
        this._auth,
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
      await signOut(this._auth);
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

  ngOnDestroy() {
    this.subscriptionUser?.unsubscribe();
  }
}
