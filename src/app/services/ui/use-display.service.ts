import { Injectable, computed, inject, signal } from "@angular/core";
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
  readonly UNKNOWN = "";
  private _destroyed = new Subject<void>();
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _breakpointObserverOrientation = inject(BreakpointObserver);

  readonly current = signal<string>(this.UNKNOWN);
  readonly orientation = signal<string>(this.UNKNOWN);

  xs = computed(() => "xs" === this.current());
  sm = computed(() => "sm" === this.current());
  md = computed(() => "md" === this.current());
  lg = computed(() => "lg" === this.current());
  xl = computed(() => "xl" === this.current());

  landscape = computed(() => "landscape" === this.orientation());
  portrait = computed(() => "portrait" === this.orientation());

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
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  // evaluate one or more media queries against the current viewport size.
  //  .isMatched("(max-width: 599px)");
  matches(displayQuery: string | readonly string[]) {
    return this._breakpointObserver.isMatched(displayQuery);
  }
}
