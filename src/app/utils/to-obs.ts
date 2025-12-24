import { defer, from, isObservable, of } from "rxjs";
import { TMaybeAsync } from "../types";

const isPromiseLike = (x: any): x is Promise<unknown> =>
  !!x && typeof x.then === "function";

export const toObs$$ = <T = unknown>(v: TMaybeAsync<T>) =>
  defer(() => (isObservable(v) ? v : isPromiseLike(v) ? from(v) : of(v)));
