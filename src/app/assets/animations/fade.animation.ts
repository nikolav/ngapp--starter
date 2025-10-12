import { animate, animation, style } from "@angular/animations";

export const fade = animation([
  style({ scale: "{{scaleFrom}}", opacity: "{{opacityFrom}}" }),
  animate(
    "{{duration}} {{easing}}",
    style({ scale: "{{scaleTo}}", opacity: "{{opacityTo}}" })
  ),
]);
