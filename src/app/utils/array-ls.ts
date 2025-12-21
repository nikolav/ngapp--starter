import identity from "lodash/identity";

// generate array of .length
// use mapfn to calculate elements
export const arrayLs = (
  length: number = 0,
  mapfn: (i: number, context?: unknown) => unknown = identity,
  context?: unknown
) => Array.from({ length }, (_, i) => mapfn(i, context));
