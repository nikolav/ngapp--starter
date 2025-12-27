import { Injectable, inject } from "@angular/core";
import {
  Router,
  // CanActivateFn,
  CanActivate,
  CanActivateChild,
  GuardResult,
  // MaybeAsync,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { StoreAuth } from "../../stores";
import { AppConfigService } from "../../services";
import { TMaybeAsync } from "../../types";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
  private $auth = inject(StoreAuth);
  private $router = inject(Router);
  private $config = inject(AppConfigService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): TMaybeAsync<GuardResult> {
    console.log("@debug:AuthGuard");
    // pass or redirect:default
    return (
      this.$auth.isAuth() ||
      this.$router.createUrlTree([
        this.$config.app.ROUTE_PATH_REDIRECT_UNATHENTICATED,
      ])
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): TMaybeAsync<GuardResult> {
    console.log("@debug:AuthGuard:canActivateChild");
    return this.canActivate(childRoute, state);
  }
}
