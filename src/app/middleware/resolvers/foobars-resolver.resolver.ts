import { ResolveFn } from "@angular/router";

export const foobarsResolverResolver: ResolveFn<string> = (route, state) => {
  return "FOOBAR";
};
