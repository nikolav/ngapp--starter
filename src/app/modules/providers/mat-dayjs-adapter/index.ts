// #https://github.com/tabuckner/material-dayjs-adapter
import { ApplicationConfig, InjectionToken } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";

import {
  DayjsDateAdapter,
  DayJsDateAdapterOptions,
  MAT_DAYJS_DATE_ADAPTER_OPTIONS,
} from "./adapter";

import { ElementOf } from "../../../types";

export const withDayjsAdapterOptions = (
  options: DayJsDateAdapterOptions = { useUtc: false }
) =>
  new InjectionToken<any>(
    "mat-dayjs-adapter-options:97707c19-4c69-5978-913e-bf41d2ed2e67",
    {
      providedIn: "root",
      factory: () => options,
    }
  );
export const provideMatDayjsAdapter = (
  ADAPTER_OPTIONS: InjectionToken<any> = MAT_DAYJS_DATE_ADAPTER_OPTIONS
): ElementOf<ApplicationConfig["providers"]> => ({
  provide: DateAdapter,
  useClass: DayjsDateAdapter,
  deps: [MAT_DATE_LOCALE, ADAPTER_OPTIONS],
});
