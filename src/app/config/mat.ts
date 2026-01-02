import type { ApplicationConfig } from "@angular/core";
import type { MatDateFormats } from "@angular/material/core";
import { COMMA, ENTER, TAB } from "@angular/cdk/keycodes";
import { MAT_CHIPS_DEFAULT_OPTIONS } from "@angular/material/chips";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MAT_SELECT_CONFIG } from "@angular/material/select";

// Custom Date-Formats and Adapter (using https://github.com/iamkun/dayjs)
export const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "MM/DD/YYYY",
  },
  display: {
    dateInput: "MM/DD/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

export const MAT_DEFAULTS: ApplicationConfig["providers"] = [
  {
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: { separatorKeyCodes: [COMMA, ENTER, TAB] },
  },
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
  {
    provide: MAT_SELECT_CONFIG,
    useValue: { disableRipple: true, canSelectNullableOptions: true },
  },
];
