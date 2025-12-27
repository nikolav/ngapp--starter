import { z } from "zod";

// #https://zod.dev/api?id=transforms
export const transformOverlayOffsets = z
  .string()
  .transform((value: string) =>
    value ? value.split(/\s+/g).map(Number) : [0, 0]
  )
  .transform((value) =>
    (1 < value.length ? value : [...value, 0, 0]).slice(0, 2)
  );
