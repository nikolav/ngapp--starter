import { animate, animation, style } from "@angular/animations";

export const slideInH = animation([
  style({ transform: "translateX({{x}})", opacity: "{{opacityFrom}}" }),
  animate(
    "{{duration}} {{easing}}",
    style({ transform: "translateX(0)", opacity: "{{opacityTo}}" })
  ),
]);
export const slideOutH = animation([
  style({ transform: "translateX(0)", opacity: "{{opacityFrom}}" }),
  animate(
    "{{duration}} {{easing}}",
    style({ transform: "translateX({{x}})", opacity: "{{opacityTo}}" })
  ),
]);
