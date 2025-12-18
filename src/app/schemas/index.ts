import { z } from "zod";
import isJWT from "validator/es/lib/isJWT";

export { schemaJsonData, schemaJsonDataRecord } from "./json.schema";
export * from "./transforms";

export const schemaJwt = z.string().refine(isJWT, { message: "Invalid JWT" });
export const schemaStringNonempty = z.string().trim().nonempty();
export const schemaStoragePatchField = schemaStringNonempty;
export const schemaStoragePatch = z.record(
  schemaStoragePatchField,
  z.unknown().nullish()
);
