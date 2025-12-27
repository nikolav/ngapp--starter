import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

interface ITriggerFadeSlideUpConfig {
  offset?: any;
  duration?: any;
}

const DEFAULT_CONFIG: ITriggerFadeSlideUpConfig = {
  offset: "2px",
  duration: ".22s",
};

export const triggerFadeSlideUp = (config?: ITriggerFadeSlideUpConfig) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  return trigger("fadeSlideUp", [
    state("visible", style({ opacity: 1, translate: "0 0" })),
    state("hidden", style({ opacity: 0, translate: `0 ${_.offset}` })),
    transition("visible <=> hidden", animate(`${_.duration} ease-out`)),
  ]);
};
