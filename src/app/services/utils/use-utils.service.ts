import { Injectable } from "@angular/core";

// 3rd party
import lodash from "lodash";
import { v4 as uuid } from "uuid";
import md5 from "md5";
import URLParse from "url-parse";
import qs from "qs";
// #https://github.com/validatorjs/validator.js
import isEmail from "validator/es/lib/isEmail";
import isURL from "validator/es/lib/isURL";
import isJWT from "validator/es/lib/isJWT";
// #https://github.com/alexei/sprintf.js#readme
import { sprintf, vsprintf } from "sprintf-js";
// #https://github.com/eturino/ts-parse-boolean
import parseBoolean from "@eturino/ts-parse-boolean";
// #https://github.com/joaonuno/tree-model-js
import TreeModel from "tree-model";

// local
import {
  coreHasOwn,
  isNumeric,
  idGen,
  parseShellInput,
  dumpJson,
  coreType,
  cat,
  onDebug,
  deepmerge,
  untilDestroyed,
  b64tob,
  error$$,
  empty$$,
  StatusResult,
  arrayLs,
  toObs$$,
  strEnsureHasPrefix,
} from "../../utils";

const {
  assign,
  castArray,
  chunk,
  clone,
  cloneDeep,
  debounce,
  defaults,
  defaultsDeep,
  difference,
  each,
  entries,
  escapeRegExp,
  every,
  filter,
  find,
  findKey,
  first,
  flow,
  fromPairs,
  get,
  groupBy,
  has: owns,
  hasIn: has,
  identity,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isFunction,
  isNil,
  isNumber,
  isPlainObject,
  isString,
  kebabCase,
  keyBy,
  last,
  map,
  merge,
  noop,
  omit,
  once,
  orderBy,
  partial,
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
  toPairs,
  trim,
  trimEnd,
  trimStart,
  uniq,
  uniqBy,
  uniqueId,
  unset,
  without,
} = lodash;

// #utils
const cloned = structuredClone.bind(null);

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
  castArray = castArray;
  chunk = chunk;
  clone = clone;
  cloneDeep = cloneDeep;
  debounce = debounce;
  deepmerge = deepmerge;
  defaults = defaults;
  defaultsDeep = defaultsDeep;
  difference = difference;
  each = each;
  entries = entries;
  escapeRegExp = escapeRegExp;
  every = every;
  filter = filter;
  find = find;
  findKey = findKey;
  first = first;
  flow = flow;
  fromPairs = fromPairs;
  get = get;
  groupBy = groupBy;
  has = has;
  identity = identity;
  includes = includes;
  isArray = isArray;
  isEmpty = isEmpty;
  isEqual = isEqual;
  isFunction = isFunction;
  isNil = isNil;
  isNumber = isNumber;
  isPlainObject = isPlainObject;
  isString = isString;
  kebabCase = kebabCase;
  keyBy = keyBy;
  last = last;
  len = len;
  map = map;
  md5 = md5;
  merge = merge;
  noop = noop;
  omit = omit;
  once = once;
  orderBy = orderBy;
  owns = owns;
  partial = partial;
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
  toPairs = toPairs;
  trim = trim;
  trimEnd = trimEnd;
  trimStart = trimStart;
  uniq = uniq;
  uniqBy = uniqBy;
  uniqueId = uniqueId;
  unset = unset;
  untilDestroyed = untilDestroyed;
  without = without;

  // sprint-js
  sprintf = sprintf;
  vsprintf = vsprintf;

  // uuid
  uuid = uuid;

  // urls, paths
  urlParse = URLParse;
  qs = qs;

  // local
  dumpJson = dumpJson;
  hasOwn = coreHasOwn;
  parseShellInput = parseShellInput;
  idGen = idGen;
  True = () => true;
  False = () => false;
  isNumeric = isNumeric;
  coreType = coreType;
  cat = cat;
  onDebug = onDebug;
  b64tob = b64tob;
  res = StatusResult.init.bind(StatusResult);
  ls = arrayLs;
  strEnsureHasPrefix = strEnsureHasPrefix;

  // observables factory
  error$$ = error$$;
  empty$$ = empty$$;
  of$$ = toObs$$;

  // 3rd party
  parseBoolean = parseBoolean;
  tree = TreeModel;

  // globals
  Math = Math;
  Date = Date;
  JSON = JSON;
  cloned = cloned;

  // etc.
  copy = Object.assign.bind(Object);
  log = console.log.bind(console);
}
