import { z } from "zod";
import { isNumeric } from "../utils/is-numeric";

// #https://zod.dev/api?id=transforms
export const transformOverlayOffsets = z
  .string()
  .trim()
  .transform((value: string) => (value ? value.split(/\s+/g) : [0, 0]))
  .refine((value) => value.every(isNumeric))
  .transform((value) => [...value.map(Number), 0, 0].slice(0, 2));
