import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import dayjs from "dayjs";

import { ITriggerFadeScaleConfig } from "../../types";

const DEFAULT_CONFIG: ITriggerFadeScaleConfig = {
  name: "fadeScale",
  scale: 0.95,
  duration: "PT0.24S",
  ease: "ease-out",
};

export const triggerVisibleHiddenFadeScale = (
  config?: ITriggerFadeScaleConfig
) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  const dur = dayjs.duration(_.duration).asMilliseconds();
  return trigger(_.name, [
    state("visible", style({ opacity: 1, scale: 1 })),
    state("hidden", style({ opacity: 0, scale: _.scale })),
    state("false", style({ opacity: 0, scale: _.scale })),
    transition("* => visible", animate(`${dur} ${_.ease}`)),
    transition("* => hidden", animate(`${dur / 2}ms ${_.ease}`)),
  ]);
};
