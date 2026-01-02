import { z } from "zod";
import transform from "lodash/transform";

import { isNumeric } from "../utils/is-numeric";
import { coreHasOwn } from "../utils";
import type { ITriggerFadeSlideConfig } from "../types";

// #https://zod.dev/api?id=transforms
export const transformOverlayOffsets = z
  .string()
  .trim()
  .transform((value: string) => (value ? value.split(/\s+/g) : [0, 0]))
  .refine((value) => value.every(isNumeric))
  .transform((value) => [...value.map(Number), 0, 0].slice(0, 2));

const triggerFadeSlideConfigKeysToNormalize = { offsetX: 1, offsetY: 1 };
export const transformTriggerFadeSlideConfig = z.transform(
  (config: ITriggerFadeSlideConfig) =>
    transform(
      config,
      (res, value, key) => {
        res[key] = coreHasOwn(triggerFadeSlideConfigKeysToNormalize, key)
          ? isNumeric(value)
            ? 0 == value
              ? 0
              : `${Number(value)}px`
            : value
          : value;
      },
      <ITriggerFadeSlideConfig>{}
    )
);
