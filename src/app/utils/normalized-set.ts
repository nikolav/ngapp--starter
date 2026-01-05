import { cat } from "./cat";
import type { TOrNoValue } from "../types";

export const normalizedSet = <T = unknown>(
  input: TOrNoValue<T | T[]>,
  defaults: T[] = []
) => {
  return Array.from(new Set(<TOrNoValue<T>[]>cat(input, defaults))).filter(
    (value) => null != value
  );
};
