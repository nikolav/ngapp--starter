import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  // CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
} from "@angular/router";
import type { ICanComponentDeactivate } from "../../types";

// export const fooGuardGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
//   return true;
// };

export class FooGuard implements CanDeactivate<ICanComponentDeactivate> {
  canDeactivate(
    component: ICanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log("@debug:FooGuard");
    return component.canDeactivate();
  }
}
