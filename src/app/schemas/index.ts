import { z } from "zod";
import isJWT from "validator/es/lib/isJWT";

export { schemaJsonData, schemaJsonDataRecord } from "./json.schema";

export const schemaJwt = z.string().refine(isJWT);

export const schemaDocsCollectionsConfig = z.object({
  topic: z.string().nonempty(),
  fields: z.array(z.string()),
  sort: z.string().nullish(),
});

export const schemaStoragePatchField = z.string().nonempty();
export const schemaStoragePatch = z.record(
  schemaStoragePatchField,
  z.any().nullish()
);
