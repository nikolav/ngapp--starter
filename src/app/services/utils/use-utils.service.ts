import { Injectable } from "@angular/core";

import lodash from "lodash";
import { v4 as uuid } from "uuid";

import isEmail from "validator/es/lib/isEmail";
import isURL from "validator/es/lib/isURL";
import isJWT from "validator/es/lib/isJWT";

import {
  coreHasOwn,
  isNumeric,
  idGen,
  parseShellInput,
  dumpJson,
  coreType,
  cat,
} from "../../utils";

const {
  assign,
  debounce,
  each,
  escapeRegExp,
  every,
  filter,
  find,
  findKey,
  first,
  get,
  includes,
  isEmpty,
  last,
  map,
  merge,
  noop,
  omit,
  once,
  pick,
  range,
  reduce,
  sample,
  set,
  shuffle,
  size: len,
  some,
  trim,
  trimEnd,
  trimStart,
  uniqueId,
} = lodash;

@Injectable({
  providedIn: "root",
})
export class UseUtilsService {
  // validator
  isEmail = isEmail;
  isURL = isURL;
  isJWT = isJWT;

  // lodash
  assign = assign;
  debounce = debounce;
  each = each;
  escapeRegExp = escapeRegExp;
  every = every;
  filter = filter;
  find = find;
  findKey = findKey;
  first = first;
  get = get;
  includes = includes;
  isEmpty = isEmpty;
  last = last;
  len = len;
  map = map;
  merge = merge;
  noop = noop;
  omit = omit;
  once = once;
  pick = pick;
  range = range;
  reduce = reduce;
  sample = sample;
  set = set;
  shuffle = shuffle;
  some = some;
  trim = trim;
  trimEnd = trimEnd;
  trimStart = trimStart;
  uniqueId = uniqueId;

  // uuid
  uuid = uuid;

  // local
  dumpJson = dumpJson;
  coreHasOwn = coreHasOwn;
  parseShellInput = parseShellInput;
  idGen = idGen;
  True = () => true;
  False = () => false;
  isNumeric = isNumeric;
  coreType = coreType;
  cat = cat;
}
