import { z } from "zod";

// #https://zod.dev/api?id=transforms
export const transformOverlayOffsets = z
  .string()
  .trim()
  .nonempty()
  .transform((value: string) => {
    // read offsets; number[]
    const offsets = value ? value.split(/\s+/g).map(Number) : [0, 0];
    // ensure .length==2; [number, number]
    return (1 < offsets.length ? offsets : [...offsets, 0, 0]).slice(0, 2);
  });
