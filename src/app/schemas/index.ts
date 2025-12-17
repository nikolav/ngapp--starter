import { z } from "zod";
import isJWT from "validator/es/lib/isJWT";

export { schemaJsonData, schemaJsonDataRecord } from "./json.schema";

export const schemaJwt = z.string().refine(isJWT, { message: "Invalid JWT" });

export const schemaDocsCollectionsConfig = z.object({
  topic: z.string().nonempty(),
  fields: z.array(z.string()),
  sort: z.string().nullish(),
});

export const schemaStoragePatchField = z.string().nonempty();
// export const schemaStoragePatch = z.record(
//   schemaStoragePatchField,
//   z.any().nullish()
// );
export const schemaStoragePatch = z.record(
  schemaStoragePatchField,
  z.unknown().nullish()
);
