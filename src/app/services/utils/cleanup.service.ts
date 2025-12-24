import { inject, Injectable } from "@angular/core";
import { from, of } from "rxjs";
import { map, reduce, mergeMap, catchError, finalize } from "rxjs/operators";

import { UseUtilsService } from "./use-utils.service";
import { TMaybeAsync } from "../../types";

type TFunctionMaybeAsync = () => TMaybeAsync<void>;

@Injectable()
export class CleanupService {
  private readonly CONCURRENCY = 10;
  private $$ = inject(UseUtilsService);

  protected readonly gc = new Set<TFunctionMaybeAsync>();

  // @@
  task(onCleanup: TFunctionMaybeAsync) {
    this.gc.add(onCleanup);
  }

  // @@
  run() {
    return !this.$$.isEmpty(this.gc)
      ? from(Array.from(this.gc)).pipe(
          mergeMap(
            (onCleanup) =>
              this.$$.toObs$$(onCleanup()).pipe(
                map(() => null),
                catchError((error) => of({ error }))
              ),
            this.CONCURRENCY
          ),
          reduce((accum, res) => {
            if (null != res?.error) {
              (<any[]>accum.error).push(res.error);
            }
            return accum;
          }, this.$$.res(null, <any[]>[])),

          map((res) => res.dump()),
          finalize(() => {
            this.reset();
          })
        )
      : of(this.$$.res(null, []).dump());
  }

  // @@
  reset() {
    this.gc.clear();
  }
}
