import mergeWith from "lodash/mergeWith";
import isArray from "lodash/isArray";
import type { TRecordJson, TOrNoValue } from "../types";

interface IArrayMergeStrategy {
  arrayMergeStrategyConcat: boolean;
}

export const deepmerge =
  (
    config: TOrNoValue<IArrayMergeStrategy> = {
      arrayMergeStrategyConcat: false,
    }
  ) =>
  (...sources: TRecordJson[]) =>
    mergeWith({}, ...sources, (obj: any, src: any) =>
      !config?.arrayMergeStrategyConcat
        ? undefined
        : isArray(obj)
        ? obj.concat(src)
        : undefined
    );
