import { Optional, Inject, InjectionToken } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

export interface DayJsDateAdapterOptions {
  /**
   * Turns the use of utc dates on or off.
   * Changing this will change how Angular Material components like DatePicker output dates.
   * @default false
   */
  useUtc?: boolean;
}

/** InjectionToken for Dayjs date adapter to configure options. */
export const MAT_DAYJS_DATE_ADAPTER_OPTIONS =
  new InjectionToken<DayJsDateAdapterOptions>(
    "MAT_DAYJS_DATE_ADAPTER_OPTIONS",
    {
      providedIn: "root",
      factory: MAT_DAYJS_DATE_ADAPTER_OPTIONS_FACTORY,
    }
  );

export function MAT_DAYJS_DATE_ADAPTER_OPTIONS_FACTORY(): DayJsDateAdapterOptions {
  return {
    useUtc: false,
  };
}

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

let _extended = false;

/** Adapts Dayjs Dates for use with Angular Material. */
export class DayjsDateAdapter extends DateAdapter<Dayjs> {
  private localeData!: {
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) public dateLocale: string,
    @Optional()
    @Inject(MAT_DAYJS_DATE_ADAPTER_OPTIONS)
    private options?: DayJsDateAdapterOptions
  ) {
    super();

    this.initializeParser(dateLocale ?? dayjs.locale());
  }

  // TODO: Implement
  override setLocale(locale: string) {
    super.setLocale(locale);

    const dayJsLocaleData = this.dayJs().localeData();
    this.localeData = {
      firstDayOfWeek: dayJsLocaleData.firstDayOfWeek(),
      longMonths: dayJsLocaleData.months(),
      shortMonths: dayJsLocaleData.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format("D")),
      longDaysOfWeek: range(7, (i) =>
        this.dayJs().set("day", i).format("dddd")
      ),
      shortDaysOfWeek: dayJsLocaleData.weekdaysShort(),
      narrowDaysOfWeek: dayJsLocaleData.weekdaysMin(),
    };
  }

  getYear(date: Dayjs): number {
    return this.dayJs(date).year();
  }

  getMonth(date: Dayjs): number {
    return this.dayJs(date).month();
  }

  getDate(date: Dayjs): number {
    return this.dayJs(date).date();
  }

  getDayOfWeek(date: Dayjs): number {
    return this.dayJs(date).day();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    return style === "long"
      ? this.localeData.longMonths
      : this.localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this.localeData.dates;
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    if (style === "long") {
      return this.localeData.longDaysOfWeek;
    }
    if (style === "short") {
      return this.localeData.shortDaysOfWeek;
    }
    return this.localeData.narrowDaysOfWeek;
  }

  getYearName(date: Dayjs): string {
    return this.dayJs(date).format("YYYY");
  }

  getFirstDayOfWeek(): number {
    return this.localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Dayjs): number {
    return this.dayJs(date).daysInMonth();
  }

  clone(date: Dayjs): Dayjs {
    return date.clone();
  }

  override createDate(year: number, month: number, date: number): Dayjs {
    if (month < 0 || month > 11) {
      throw Error(`DayjsDateAdapter: Invalid month index "${month}".`);
    }
    if (date < 1) {
      throw Error(`DayjsDateAdapter: Invalid date "${date}".`);
    }

    const result = this.dayJs()
      .set("year", year)
      .set("month", month)
      .set("date", date);

    if (!result.isValid()) {
      throw Error(
        `DayjsDateAdapter: Invalid date "${date}" for month "${month}".`
      );
    }

    return result;
  }

  today(): Dayjs {
    return this.dayJs();
  }

  override parse(value: any, parseFormat: string): Dayjs | null {
    if (value == null || value === "") return null;

    if (typeof value === "string") {
      const loc = this.locale;
      const ld = this.dayJs().locale(loc).localeData();

      // If parseFormat is localized token like 'L', 'LL', map it.
      // If it's a real format string (e.g. 'DD-MM-YYYY'), use it directly.
      const fmt = /^[Ll]+$/.test(parseFormat)
        ? ld.longDateFormat(parseFormat)
        : parseFormat;

      return this.dayJs(value, fmt, loc);
    }

    return this.dayJs(value).locale(this.locale);
  }

  format(date: Dayjs, displayFormat: string): string {
    if (!this.isValid(date)) {
      throw Error("DayjsDateAdapter: Cannot format invalid date.");
    }
    return date.locale(this.locale).format(displayFormat);
  }

  addCalendarYears(date: Dayjs, years: number): Dayjs {
    return date.add(years, "year");
  }

  addCalendarMonths(date: Dayjs, months: number): Dayjs {
    return date.add(months, "month");
  }

  addCalendarDays(date: Dayjs, days: number): Dayjs {
    return date.add(days, "day");
  }

  toIso8601(date: Dayjs): string {
    return date.toISOString();
  }

  override deserialize(value: any): Dayjs | null {
    if (value == null || value === "") return null;

    if (value instanceof Date) {
      const d = this.dayJs(value);
      return this.isValid(d) ? d : this.invalid();
    }

    if (this.isDateInstance(value)) {
      return this.clone(value);
    }

    if (typeof value === "string") {
      // accept ISO and other unambiguous formats from backend
      const d = this.dayJs(value);
      return this.isValid(d) ? d : this.invalid();
    }

    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return dayjs.isDayjs(obj);
  }

  override isValid(date: Dayjs): boolean {
    return dayjs.isDayjs(date) && date.isValid();
  }

  override invalid(): Dayjs {
    return dayjs("");
  }

  override sameDate(a: Dayjs | null, b: Dayjs | null): boolean {
    if (a && b) return a.isSame(b, "day");
    return a === b;
  }

  private dayJs(input?: any, format?: string, locale?: string): Dayjs {
    const loc = locale ?? this.locale;

    let d = format
      ? // strict parsing is a big win for typed input
        dayjs(input, format, loc, true)
      : dayjs(input);

    d = d.locale(loc);
    return this.shouldUseUtc ? d.utc() : d;
  }

  private get shouldUseUtc(): boolean {
    const { useUtc }: DayJsDateAdapterOptions = this.options || {};
    return !!useUtc;
  }

  private initializeParser(dateLocale: string) {
    if (!_extended) {
      if (this.shouldUseUtc) {
        dayjs.extend(utc);
      }

      dayjs.extend(LocalizedFormat);
      dayjs.extend(customParseFormat);
      dayjs.extend(localeData);

      _extended = true;
    }

    this.setLocale(dateLocale);
  }
}
