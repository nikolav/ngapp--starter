import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { ITriggerFadeSlideConfig } from "../../types";

const DEFAULT_CONFIG: ITriggerFadeSlideConfig = {
  name: "fadeSlide",
  offsetX: 0,
  offsetY: "2px",
  duration: ".22s",
  ease: "ease-out",
};

export const triggerVisibleHiddenFadeSlide = (config?: ITriggerFadeSlideConfig) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  return trigger(_.name, [
    state("visible", style({ opacity: 1, translate: "0 0" })),
    state(
      "hidden",
      style({ opacity: 0, translate: `${_.offsetX} ${_.offsetY}` })
    ),
    transition("visible <=> hidden", animate(`${_.duration} ${_.ease}`)),
  ]);
};
