import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, reduce, catchError, tap } from "rxjs/operators";

import { UseUtilsService } from "./use-utils.service";
import { TCleanupCallback } from "../../types";

@Injectable()
export class CleanupService {
  private $$ = inject(UseUtilsService);

  protected readonly gc = new Set<TCleanupCallback>();

  // @@
  tasks(...args: TCleanupCallback[]) {
    args.forEach((onCleanup) => this.gc.add(onCleanup));
  }

  // @@
  run() {
    return !this.$$.isEmpty(this.gc)
      ? new Observable((obs) => {
          let i = 0;
          this.gc.forEach((onCleanup) => {
            try {
              onCleanup(() => {
                obs.next(this.$$.res(i++, null));
                if (this.gc.size == i) {
                  obs.complete();
                }
              });
            } catch (error) {
              obs.error(error);
            }
          });
        }).pipe(
          catchError((error) => of(this.$$.res(null, error))),
          reduce((accum, res) => {
            const error_ = this.$$.get(res, "error", null);
            if (null != error_) {
              (<any[]>accum.error).push(error_);
            }
            return accum;
          }, this.$$.res(null, <any[]>[])),
          map((res) => res.dump()),
          tap(() => {
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
