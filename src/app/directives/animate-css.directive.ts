import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
} from "@angular/core";
import { UseUtilsService } from "../services";
import type { TOrNoValue } from "../types";

@Directive({
  selector: "[animateCss]",
})
export class AnimateCssDirective {
  // .
  private $renderer = inject(Renderer2);
  private $$ = inject(UseUtilsService);

  // _
  private readonly classAnimated = "animate__animated";

  // #
  private host = inject<ElementRef<Element>>(ElementRef);

  // [@]
  readonly animate = input.required({ alias: "animateCss" });
  // [@]
  // trigger on key:change
  readonly key = input<TOrNoValue<string>>(undefined, {
    alias: "animateCssKey",
  });
  // [@]
  readonly duration = input(1000, {
    alias: "animateCssDuration",
    transform: (val: any) =>
      this.$$.isNumeric(val) ? `${Number(val) / 1000}s` : val,
  });
  // [@]
  readonly disabled = input<boolean>(false, {
    alias: "animateCssDisabled",
  });
  // (@)
  readonly start = output<Event>({ alias: "animateCssAnimationStart" });
  // (@)
  readonly end = output<Event>({ alias: "animateCssAnimationEnd" });

  constructor() {
    effect((cleanup) => {
      if (this.disabled() || !this.key()) return;

      const el = this.host.nativeElement;

      const classAnimation = `animate__${this.animate()}`;

      // // Remove existing classes to allow retrigger
      // this.$renderer.removeClass(el, classAnimation);
      // this.$renderer.removeClass(el, classAnimated);
      // // force reflow
      // void (<HTMLElement>el).offsetWidth;

      const offStart_ = this.$renderer.listen(
        el,
        "animationstart",
        (event: AnimationEvent) => {
          if (event.target !== el) return;
          this.start.emit(event);
        }
      );
      const offEnd_ = this.$renderer.listen(
        el,
        "animationend",
        (event: AnimationEvent) => {
          if (event.target !== el) return;
          this.$renderer.removeClass(el, classAnimation);
          this.$renderer.removeClass(el, this.classAnimated);
          this.end.emit(event);
        }
      );

      this.$renderer.setStyle(el, "--animate-duration", this.duration());
      // trigger animation
      this.$renderer.addClass(el, classAnimation);
      this.$renderer.addClass(el, this.classAnimated);

      cleanup(() => {
        offStart_();
        offEnd_();
        // Also clean styles/classes if directive is torn down mid-animation
        this.$renderer.removeClass(el, classAnimation);
        this.$renderer.removeClass(el, this.classAnimated);
        this.$renderer.removeStyle(el, "--animate-duration");
      });
    });
  }
}
