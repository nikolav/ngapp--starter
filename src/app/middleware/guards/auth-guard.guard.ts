import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  // CanActivateFn,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
} from "@angular/router";

// export const authGuardGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log("@debug:AuthGuard");
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log("@debug:AuthGuard:canActivateChild");
    return true;
  }
}
