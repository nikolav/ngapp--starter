import type { ZodType } from "zod";

import { schemaStatusResultDump } from "../schemas";
import { TOrNoValue } from "../types";

export class StatusResult<TResult = unknown, TError = unknown> {
  constructor(
    public result: TOrNoValue<TResult>,
    public error: TOrNoValue<TError>
  ) {}
  dump(schemaDump: ZodType = schemaStatusResultDump) {
    return schemaDump.parse(this);
  }
  static init(result: unknown, error: unknown) {
    return new StatusResult(result, error);
  }
}
