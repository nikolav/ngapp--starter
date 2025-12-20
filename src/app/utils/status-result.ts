import type { ZodType } from "zod";

import { schemaStatusResultDump_ } from "../schemas";
import { TOrNoValue } from "../types";

export class StatusResult<TResult = unknown, TError = unknown> {
  constructor(
    public result: TOrNoValue<TResult>,
    public error: TOrNoValue<TError>
  ) {}
  dump(schemaResult?: ZodType) {
    return schemaStatusResultDump_(schemaResult).parse(this);
  }
  static init(...args: unknown[]) {
    return new StatusResult(args[0], args[1]);
  }
}
