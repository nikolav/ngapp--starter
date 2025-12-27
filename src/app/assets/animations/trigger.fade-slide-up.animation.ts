import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

interface ITriggerFadeSlideConfig {
  offsetX?: any;
  offsetY?: any;
  duration?: any;
  ease?: any;
}

const DEFAULT_CONFIG: ITriggerFadeSlideConfig = {
  offsetX: 0,
  offsetY: "2px",
  duration: ".22s",
  ease: "ease-out",
};

export const triggerFadeSlideUp = (config?: ITriggerFadeSlideConfig) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  return trigger("fadeSlideUp", [
    state("visible", style({ opacity: 1, translate: "0 0" })),
    state(
      "hidden",
      style({ opacity: 0, translate: `${_.offsetX} ${_.offsetY}` })
    ),
    transition("visible <=> hidden", animate(`${_.duration} ${_.ease}`)),
  ]);
};
