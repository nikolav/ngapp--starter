import { z } from "zod";

// #https://zod.dev/api?id=transforms
export const transformOverlayOffsets = z
  .string()
  .trim()
  .nonempty()
  .transform((value: string) => {
    const offsets = value ? value.split(/\s+/g).map(Number) : [0, 0];
    return (1 < offsets.length ? offsets : [...offsets, 0, 0]).slice(0, 2);
  });
