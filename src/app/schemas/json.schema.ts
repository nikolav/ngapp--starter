import { z } from "zod";

const schemaJsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

type JsonLiteral = z.infer<typeof schemaJsonLiteral>;
type Json = JsonLiteral | { [key: string]: Json } | Json[];

export type TJsonLiteral = JsonLiteral;
export type TJson = Json;
export type JsonDataRecord = { [key: string]: Json };

// export const schemaJsonData: z.ZodType<Json> = z.lazy(() =>
//   z.union([
//     schemaJsonLiteral,
//     z.array(schemaJsonData),
//     // v4: record(keyType, valueType)
//     z.record(z.string(), schemaJsonData),
//   ])
// );
export const schemaJsonData = z.json();

export const schemaJsonDataRecord: z.ZodType<{ [key: string]: Json }> = z.lazy(
  () => z.record(z.string(), schemaJsonData)
);
