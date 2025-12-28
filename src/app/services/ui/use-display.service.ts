import { Injectable, computed, inject, signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject, fromEvent } from "rxjs";
import { takeUntil, throttleTime } from "rxjs/operators";

import { TOrNoValue } from "../../types";

const DISPLAY_NAMES = new Map([
  [Breakpoints.XSmall, "xs"],
  [Breakpoints.Small, "sm"],
  [Breakpoints.Medium, "md"],
  [Breakpoints.Large, "lg"],
  [Breakpoints.XLarge, "xl"],
]);
const Q_ORIENTATION_PORTRAIT = "(orientation: portrait)";
const Q_ORIENTATION_LANDSCAPE = "(orientation: landscape)";
const DISPLAY_ORIENTATIONS = new Map([
  [Q_ORIENTATION_PORTRAIT, "portrait"],
  [Q_ORIENTATION_LANDSCAPE, "landscape"],
]);

@Injectable({
  providedIn: "root",
})
export class UseDisplayService {
  protected UNKNOWN = "";
  protected THROTTLE_TIME_wResize = 122;

  protected _breakpointObserver = inject(BreakpointObserver);
  protected _breakpointObserverOrientation = inject(BreakpointObserver);

  protected _destroyed = new Subject<void>();

  // @@
  readonly current = signal<string>(this.UNKNOWN);
  readonly orientation = signal<string>(this.UNKNOWN);
  readonly width = signal<TOrNoValue<number>>(window.innerWidth);

  readonly xs = computed(() => "xs" === this.current());
  readonly sm = computed(() => "sm" === this.current());
  readonly md = computed(() => "md" === this.current());
  readonly lg = computed(() => "lg" === this.current());
  readonly xl = computed(() => "xl" === this.current());

  readonly landscape = computed(() => "landscape" === this.orientation());
  readonly portrait = computed(() => "portrait" === this.orientation());
  // /@@

  // sync window width
  protected width_s = fromEvent(window, "resize")
    .pipe(
      takeUntil(this._destroyed),
      throttleTime(this.THROTTLE_TIME_wResize, undefined, {
        trailing: true,
      })
    )
    .subscribe(() => {
      this.width.set(window.innerWidth);
    });

  constructor() {
    // sync size
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
    // sync orientation
    this._breakpointObserverOrientation
      .observe([Q_ORIENTATION_PORTRAIT, Q_ORIENTATION_LANDSCAPE])
      .pipe(takeUntil(this._destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.orientation.set(
              DISPLAY_ORIENTATIONS.get(query) ?? this.UNKNOWN
            );
          }
        }
      });
  }

  // @@
  // evaluate one or more media queries against the current viewport size.
  //  .isMatched("(max-width: 599px)");
  matches(displayQuery: string | readonly string[]) {
    return this._breakpointObserver.isMatched(displayQuery);
  }

  // @@
  destroy() {
    this.width_s?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
