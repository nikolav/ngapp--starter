import {
  trigger,
  transition,
  style,
  query,
  animate,
  animateChild,
  group,
} from "@angular/animations";

export const routeTransitionBlurInOut = trigger("routeTransitionBlurInOut", [
  transition("* => *", [
    // 'position-relative'@host
    style({ position: "relative" }),
    // 'position-absolute'@children
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }),
      ],
      { optional: true }
    ),
    // start state for :enter
    query(":enter", [style({ opacity: 0, filter: "blur(.022rem)" })], {
      optional: true,
    }),
    // run children :leave animations
    query(":leave", animateChild(), { optional: true }),
    // run :enter :leave animations in parallel
    //  both incoming/outgoing routes are animated
    group([
      query(
        ":leave",
        [
          animate(
            "122ms ease-in",
            style({ opacity: 0, filter: "blur(.022rem)" })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(":enter", [animate("122ms ease-in", style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);
