import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import dayjs from "dayjs";

import { ITriggerFadeSlideConfig } from "../../types";

const DEFAULT_CONFIG: ITriggerFadeSlideConfig = {
  name: "fadeSlide",
  offsetX: 0,
  offsetY: "2px",
  duration: "PT0.24S",
  ease: "ease-out",
};

export const triggerVisibleHiddenFadeSlide = (
  config?: ITriggerFadeSlideConfig
) => {
  const _ = Object.assign({}, DEFAULT_CONFIG, config);
  const dur = dayjs.duration(_.duration).asMilliseconds();
  return trigger(_.name, [
    state("visible", style({ opacity: 1, translate: "0 0" })),
    state(
      "hidden",
      style({
        opacity: 0,
        translate: `${_.offsetX} ${_.offsetY}`,
      })
    ),
    state(
      "false",
      style({
        opacity: 0,
        translate: `${_.offsetX} ${_.offsetY}`,
      })
    ),
    transition("visible => hidden", animate(`${dur / 2}ms ${_.ease}`)),
    transition("* => visible", animate(`${dur}ms ${_.ease}`)),
  ]);
};
