import { Injectable, computed, inject, signal } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Subject, fromEvent } from "rxjs";
import { takeUntil, throttleTime } from "rxjs/operators";

import { TOrNoValue } from "../../types";
import { UseUtilsService } from "../utils";
import { BreakpointsCustom } from "../../assets/breakpoints";

const DISPLAY_NAMES = new Map([
  [BreakpointsCustom.XSmall, "xs"],
  [BreakpointsCustom.Small, "sm"],
  [BreakpointsCustom.Medium, "md"],
  [BreakpointsCustom.Large, "lg"],
  [BreakpointsCustom.XLarge, "xl"],
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

  protected $$ = inject(UseUtilsService);
  protected $b = inject(BreakpointObserver);

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
    this.$b
      .observe([
        BreakpointsCustom.XSmall,
        BreakpointsCustom.Small,
        BreakpointsCustom.Medium,
        BreakpointsCustom.Large,
        BreakpointsCustom.XLarge,
      ])
      .pipe(takeUntil(this._destroyed))
      .subscribe((result) => {
        const query = this.$$.findKey(result.breakpoints, (value) => value);
        if (query) {
          this.current.set(DISPLAY_NAMES.get(<any>query) ?? this.UNKNOWN);
        }
      });
    // sync orientation
    this.$b
      .observe([Q_ORIENTATION_PORTRAIT, Q_ORIENTATION_LANDSCAPE])
      .pipe(takeUntil(this._destroyed))
      .subscribe((result) => {
        const query = this.$$.findKey(result.breakpoints, (value) => value);
        if (query) {
          this.orientation.set(DISPLAY_ORIENTATIONS.get(query) ?? this.UNKNOWN);
        }
      });
  }

  // @@
  // evaluate one or more media queries against the current viewport size.
  //  .isMatched("(max-width: 599px)");
  matches(displayQuery: string | readonly string[]) {
    return this.$b.isMatched(displayQuery);
  }

  // @@
  destroy() {
    this.width_s?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
