import { Injectable } from "@angular/core";

import lodash from "lodash";
import { v4 as uuid } from "uuid";

// #https://github.com/validatorjs/validator.js
import isEmail from "validator/es/lib/isEmail";
import isURL from "validator/es/lib/isURL";
import isJWT from "validator/es/lib/isJWT";

// #https://github.com/alexei/sprintf.js#readme
import { sprintf, vsprintf } from "sprintf-js";

import {
  coreHasOwn,
  isNumeric,
  idGen,
  parseShellInput,
  dumpJson,
  coreType,
  cat,
  onDebug,
} from "../../utils";

const {
  assign,
  debounce,
  clone,
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
  isEqual,
  isString,
  kebabCase,
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
  startCase,
  take,
  takeRight,
  throttle,
  trim,
  trimEnd,
  trimStart,
  uniqueId,
  unset,
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
  clone = clone;
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
  isEqual = isEqual;
  isString = isString;
  kebabCase = kebabCase;
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
  startCase = startCase;
  take = take;
  takeRight = takeRight;
  throttle = throttle;
  trim = trim;
  trimEnd = trimEnd;
  trimStart = trimStart;
  uniqueId = uniqueId;
  unset = unset;

  // sprint-js
  sprintf = sprintf;
  vsprintf = vsprintf;

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
  onDebug = onDebug;

  // globals
  Math = Math;
  Date = Date;
  JSON = JSON;
}
