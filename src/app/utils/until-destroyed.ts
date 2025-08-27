import { DestroyRef, inject } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const destroyMap = new WeakMap<DestroyRef, Subject<void>>();

export const untilDestroyed = <T>() => {
  const dr = inject(DestroyRef);
  let destroy$ = destroyMap.get(dr);
  if (!destroy$) {
    destroy$ = new Subject<void>();
    destroyMap.set(dr, destroy$);

    dr.onDestroy(() => {
      destroy$!.next();
      destroy$!.complete();
      destroyMap.delete(dr);
    });
  }

  return takeUntil<T>(destroy$);
};
