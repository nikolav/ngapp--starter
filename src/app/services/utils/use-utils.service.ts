import { Injectable } from '@angular/core';

import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import isEmail from 'validator/es/lib/isEmail';
import isURL from 'validator/es/lib/isURL';

import { idGen } from './id-gen';
import { isNumeric } from './is-numeric';
import { parseShellArgs } from './parse-shell-args';
import { coreHasOwn } from './core-has-own';

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
} = lodash;

@Injectable({
  providedIn: 'root',
})
export class UseUtilsService {
  // validator
  isEmail = isEmail;
  isURL = isURL;

  // lodash
  includes = includes;
  each = each;
  every = every;
  filter = filter;
  find = find;
  get = get;
  isEmpty = isEmpty;
  len = len;
  map = map;
  noop = noop;
  once = once;
  reduce = reduce;
  set = set;
  some = some;
  trim = trim;
  trimEnd = trimEnd;
  trimStart = trimStart;

  // uuid
  uuid = uuid;

  // local
  coreHasOwn = coreHasOwn;
  parseShellArgs = parseShellArgs;
  idGen = idGen;
  True = () => true;
  False = () => false;
  isNumeric = isNumeric;
}
