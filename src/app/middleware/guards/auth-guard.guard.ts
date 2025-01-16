import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  ActivatedRouteSnapshot,
  // CanActivateFn,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
} from "@angular/router";
import { StoreAuth } from "../../stores";
import { AppConfigService } from "../../services";
// export const authGuardGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
  private $auth = inject(StoreAuth);
  private $router = inject(Router);
  private $config = inject(AppConfigService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
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
  ): MaybeAsync<GuardResult> {
    console.log("@debug:AuthGuard:canActivateChild");
    return true;
  }
}
