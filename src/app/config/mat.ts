import type { ApplicationConfig } from "@angular/core";
import { COMMA, ENTER, TAB } from "@angular/cdk/keycodes";

import { MAT_CHIPS_DEFAULT_OPTIONS } from "@angular/material/chips";

export const MAT_DEFAULTS: ApplicationConfig["providers"] = [
  {
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: { separatorKeyCodes: [COMMA, ENTER, TAB] },
  },
];
