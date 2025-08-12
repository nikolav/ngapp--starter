// # https://github.com/animate-css/animate.css
import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  Renderer2,
  OnDestroy,
  output,
} from "@angular/core";
import { UseUtilsService } from "../services";
import { TOrNoValue } from "../types";

@Directive({
  selector: "[animateCss]",
})
export class AnimatecssDirective implements OnDestroy {
  private $renderer = inject(Renderer2);
  private elRef = inject(ElementRef);

  private $$ = inject(UseUtilsService);

  private readonly defaultPrefix = "animate__";
  private readonly defaultDuration = 1000;
  private cleanupFn: TOrNoValue<() => void> = null;

  // Input for animation class (without 'animate__' prefix)
  animateCss = input("", {
    // matches the directive selector
    alias: "animateCss",
  });

  animateCssAnimationStart = output<TOrNoValue<Event>>();
  animateCssAnimationEnd = output<TOrNoValue<Event>>();

  // Input to disable animations
  disabled = input(false);

  duration = input(this.defaultDuration, {
    alias: "animateCssDuration",
    transform: (d: any) => (this.$$.isNumeric(d) ? `${Number(d) / 1000}s` : d),
  });

  // Model to trigger animations
  key = model("", {
    alias: "animateCssKey",
  });

  constructor() {
    effect(() => {
      if (this.key() && !this.disabled()) {
        this.triggerAnimateCss();
      }
    });
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  async triggerAnimateCss() {
    this.removeEventListeners();

    const node = this.elRef.nativeElement;
    const animation = this.animateCss();
    const prefix = this.defaultPrefix;

    if (!node || !animation) {
      return;
    }

    const animationName = `${prefix}${animation}`;
    const animatedClass = `${prefix}animated`;

    const unlistenStart_ = this.$renderer.listen(
      node,
      "animationstart",
      (event: Event) => {
        this.animateCssAnimationStart.emit(event);
      }
    );
    const unlistenEnd_ = this.$renderer.listen(
      node,
      "animationend",
      (event: Event) => {
        event.stopPropagation();
        this.removeAnimationClasses(node, animatedClass, animationName);
        this.cleanupFn = null;
        this.animateCssAnimationEnd.emit(event);
      }
    );

    this.cleanupFn = () => {
      unlistenStart_();
      unlistenEnd_();
      this.removeAnimationClasses(node, animatedClass, animationName);
    };

    node.style.setProperty("--animate-duration", this.duration());

    // Add animation classes
    this.$renderer.addClass(node, animatedClass);
    this.$renderer.addClass(node, animationName);
  }

  private removeAnimationClasses(node: any, ...classes: string[]) {
    classes.forEach((className) => {
      this.$renderer.removeClass(node, className);
    });
  }

  private removeEventListeners() {
    if (this.cleanupFn) {
      this.cleanupFn();
      this.cleanupFn = null;
    }
  }
}

// @@Attention seekers
// bounce: 1,
// flash: 1,
// headShake: 1,
// heartBeat: 1,
// jello: 1,
// pulse: 1,
// rubberBand: 1,
// shakeX: 1,
// shakeY: 1,
// swing: 1,
// tada: 1,
// wobble: 1,
// //
// // @@Back entrances
// backInDown: 1,
// backInLeft: 1,
// backInRight: 1,
// backInUp: 1,
// //
// // @@Back exits
// backOutDown: 1,
// backOutLeft: 1,
// backOutRight: 1,
// backOutUp: 1,
// //
// // @@Bouncing entrances
// bounceIn: 1,
// bounceInDown: 1,
// bounceInLeft: 1,
// bounceInRight: 1,
// bounceInUp: 1,
// //
// // @@Bouncing exits
// bounceOut: 1,
// bounceOutDown: 1,
// bounceOutLeft: 1,
// bounceOutRight: 1,
// bounceOutUp: 1,
// //
// // @@Fading entrances
// fadeIn: 1,
// fadeInDown: 1,
// fadeInDownBig: 1,
// fadeInLeft: 1,
// fadeInLeftBig: 1,
// fadeInRight: 1,
// fadeInRightBig: 1,
// fadeInUp: 1,
// fadeInUpBig: 1,
// fadeInTopLeft: 1,
// fadeInTopRight: 1,
// fadeInBottomLeft: 1,
// fadeInBottomRight: 1,
// //
// // @@Fading exits
// fadeOut: 1,
// fadeOutDown: 1,
// fadeOutDownBig: 1,
// fadeOutLeft: 1,
// fadeOutLeftBig: 1,
// fadeOutRight: 1,
// fadeOutRightBig: 1,
// fadeOutUp: 1,
// fadeOutUpBig: 1,
// fadeOutTopLeft: 1,
// fadeOutTopRight: 1,
// fadeOutBottomRight: 1,
// fadeOutBottomLeft: 1,
// //
// // @@Flippers
// flip: 1,
// flipInX: 1,
// flipInY: 1,
// flipOutX: 1,
// flipOutY: 1,
// //
// // @@Lightspeed
// lightSpeedInRight: 1,
// lightSpeedInLeft: 1,
// lightSpeedOutRight: 1,
// lightSpeedOutLeft: 1,
// //
// // @@Rotating entrances
// rotateIn: 1,
// rotateInDownLeft: 1,
// rotateInDownRight: 1,
// rotateInUpLeft: 1,
// rotateInUpRight: 1,
// //
// // @@Rotating exits
// rotateOut: 1,
// rotateOutDownLeft: 1,
// rotateOutDownRight: 1,
// rotateOutUpLeft: 1,
// rotateOutUpRight: 1,
// //
// // @@Specials
// hinge: 1,
// jackInTheBox: 1,
// rollIn: 1,
// rollOut: 1,
// //
// // @@Zooming entrances
// zoomIn: 1,
// zoomInDown: 1,
// zoomInLeft: 1,
// zoomInRight: 1,
// zoomInUp: 1,
// //
// // @@Zooming exits
// zoomOut: 1,
// zoomOutDown: 1,
// zoomOutLeft: 1,
// zoomOutRight: 1,
// zoomOutUp: 1,
// //
// // @@Sliding entrances
// slideInDown: 1,
// slideInLeft: 1,
// slideInRight: 1,
// slideInUp: 1,
// //
// // @@Sliding exits
// slideOutDown: 1,
// slideOutLeft: 1,
// slideOutRight: 1,
// slideOutUp: 1,
