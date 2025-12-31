import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { fromEvent } from "rxjs";
import { map, throttleTime } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { UseUtilsService } from "../utils";
import { TOKEN_breakpoints, TOKEN_windowDefaultView } from "../../keys";

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
  protected BreakpointsCustom = inject(TOKEN_breakpoints);
  protected viewportRuler = inject(ViewportRuler);
  protected window = inject(TOKEN_windowDefaultView);

  protected DISPLAY_NAMES = new Map([
    [this.BreakpointsCustom.XSmall, "xs"],
    [this.BreakpointsCustom.Small, "sm"],
    [this.BreakpointsCustom.Medium, "md"],
    [this.BreakpointsCustom.Large, "lg"],
    [this.BreakpointsCustom.XLarge, "xl"],
  ]);

  protected _destroyed = inject(DestroyRef);

  // @@
  readonly current = signal<string>(this.UNKNOWN);
  readonly orientation = signal<string>(this.UNKNOWN);
  readonly width = signal<number>(this.window!.innerWidth);

  readonly xs = computed(() => "xs" === this.current());
  readonly sm = computed(() => "sm" === this.current());
  readonly md = computed(() => "md" === this.current());
  readonly lg = computed(() => "lg" === this.current());
  readonly xl = computed(() => "xl" === this.current());

  readonly landscape = computed(() => "landscape" === this.orientation());
  readonly portrait = computed(() => "portrait" === this.orientation());

  readonly viewportSize$ = this.viewportRuler
    .change(this.THROTTLE_TIME_wResize)
    .pipe(
      takeUntilDestroyed(this._destroyed),
      map((event) => ({ event, ruler: this.viewportRuler }))
    );
  // /@@

  // sync window width
  protected width_s = fromEvent(this.window!, "resize")
    .pipe(
      takeUntilDestroyed(this._destroyed),
      throttleTime(this.THROTTLE_TIME_wResize, undefined, {
        trailing: true,
      })
    )
    .subscribe(() => {
      this.width.set(this.window!.innerWidth);
    });

  constructor() {
    // sync size
    this.$b
      .observe([
        this.BreakpointsCustom.XSmall,
        this.BreakpointsCustom.Small,
        this.BreakpointsCustom.Medium,
        this.BreakpointsCustom.Large,
        this.BreakpointsCustom.XLarge,
      ])
      .pipe(takeUntilDestroyed(this._destroyed))
      .subscribe((result) => {
        const query = this.$$.findKey(result.breakpoints, (value) => value);
        if (query) {
          this.current.set(this.DISPLAY_NAMES.get(<any>query) ?? this.UNKNOWN);
        }
      });
    // sync orientation
    this.$b
      .observe([Q_ORIENTATION_PORTRAIT, Q_ORIENTATION_LANDSCAPE])
      .pipe(takeUntilDestroyed(this._destroyed))
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
  }
}
