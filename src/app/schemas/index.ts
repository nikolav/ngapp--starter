import { z } from "zod";
import isJWT from "validator/es/lib/isJWT";

export { schemaJsonData, schemaJsonDataRecord } from "./json.schema";
export * from "./transforms";

export const schemaJwt = z.string().refine(isJWT);
export const schemaStringNonempty = z.string().trim().nonempty();
export const schemaStoragePatchField = schemaStringNonempty;
export const schemaStoragePatch = z.record(
  schemaStoragePatchField,
  z.unknown().nullish()
);
export const schemaFirestoreDocPath = z
  .string()
  .nonempty()
  .refine((p) => {
    if (p.startsWith("/") || p.endsWith("/")) return false;
    const parts = p.split("/");
    return 1 === parts.length % 2 && parts.every((part) => 0 < part.length);
  });
export const schemaStatusResultDump = z.object({
  error: z.unknown(),
  result: z.unknown(),
});
export const schemaSize = z.object({
  width: z.number(),
  height: z.number(),
});
