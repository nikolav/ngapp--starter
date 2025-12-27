import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { ITriggerFadeScaleConfig } from "../../types";

const DEFAULT_CONFIG: ITriggerFadeScaleConfig = {
  name: "fadeScale",
  scale: 0.95,
  duration: ".22s",
  ease: "ease-out",
};

export const triggerFadeScale = (config?: ITriggerFadeScaleConfig) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  return trigger(_.name, [
    state("visible", style({ opacity: 1, scale: 1 })),
    state("hidden", style({ opacity: 0, scale: _.scale })),
    transition("visible <=> hidden", animate(`${_.duration} ${_.ease}`)),
  ]);
};
