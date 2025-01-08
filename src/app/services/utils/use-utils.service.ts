import { Injectable } from "@angular/core";

import lodash from "lodash";
import { v4 as uuid } from "uuid";

import isEmail from "validator/es/lib/isEmail";
import isURL from "validator/es/lib/isURL";
import isJWT from "validator/es/lib/isJWT";

import { idGen } from "./id-gen";
import { isNumeric } from "./is-numeric";
import { parseShellArgs as parseShellInput } from "./parse-shell-args";
import { coreHasOwn } from "./core-has-own";

const {
  get,
  set,
  some,
  noop,
  every,
  each,
  reduce,
  isEmpty,
  map,
  filter,
  find,
  once,
  size: len,
  trim,
  trimEnd,
  trimStart,
  includes,
  assign,
  debounce,
  escapeRegExp,
  first,
  last,
  omit,
  pick,
  sample,
  shuffle,
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
  first = first;
  get = get;
  includes = includes;
  isEmpty = isEmpty;
  last = last;
  len = len;
  map = map;
  noop = noop;
  omit = omit;
  once = once;
  pick = pick;
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
  coreHasOwn = coreHasOwn;
  parseShellInput = parseShellInput;
  idGen = idGen;
  True = () => true;
  False = () => false;
  isNumeric = isNumeric;
}
