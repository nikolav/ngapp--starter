import { Injectable, inject, signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const DISPLAY_NAMES = new Map([
  [Breakpoints.XSmall, "xs"],
  [Breakpoints.Small, "sm"],
  [Breakpoints.Medium, "md"],
  [Breakpoints.Large, "lg"],
  [Breakpoints.XLarge, "xl"],
]);

@Injectable({
  providedIn: "root",
})
export class UseDisplayService {
  readonly UNKNOWN = "";
  private _destroyed = new Subject<void>();
  private readonly _breakpointObserver = inject(BreakpointObserver);

  readonly current = signal<string>(this.UNKNOWN);

  constructor() {
    this._breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this._destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.current.set(DISPLAY_NAMES.get(query) ?? this.UNKNOWN);
          }
        }
      });
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  // evaluate one or more media queries against the current viewport size.
  //  .isMatched("(max-width: 599px)");
  matches(displayQuery: any) {
    return this._breakpointObserver.isMatched(displayQuery);
  }
}
