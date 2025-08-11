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
  transition("* <=> *", [
    // Wildcard for any route change
    style({ position: "relative" }),
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
    query(":enter", [style({ opacity: 0, filter: "blur(.122rem)" })], {
      optional: true,
    }),
    query(":leave", animateChild(), { optional: true }),
    group([
      query(
        ":leave",
        [
          animate(
            "122ms ease-out",
            style({ opacity: 0, filter: "blur(.122rem)" })
          ),
        ],
        {
          optional: true,
        }
      ),
      query(":enter", [animate("122ms ease-out", style({ opacity: 1 }))], {
        optional: true,
      }),
    ]),
  ]),
]);
