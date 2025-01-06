import { Injectable } from '@angular/core';

import { v4 as uuid } from 'uuid';

import get from 'lodash/get';
import set from 'lodash/set';
import some from 'lodash/some';
import noop from 'lodash/noop';
import every from 'lodash/every';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';

import { idGen } from './id-gen';

@Injectable({
  providedIn: 'root',
})
export class UseUtilsService {
  // lodash
  noop = noop;
  isEmpty = isEmpty;
  get = get;
  set = set;
  some = some;
  every = every;
  each = each;
  reduce = reduce;
  // 3rd pty
  uuid = uuid;
  // local
  idGen = idGen;
  True = () => true;
  False = () => false;
}
