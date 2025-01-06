import { Injectable } from '@angular/core';

import { UseUtilsService } from '../services';
import type { TRecordJson } from '../types';
//
@Injectable({
  providedIn: 'root',
})
export class StoreMain {
  $$store = <TRecordJson>{};
  constructor(private $$: UseUtilsService) {}
  push(patch: any) {
    this.$$.each(patch, (value, path) => {
      this.$$.set(this.$$store, path, value);
    });
  }
  pull(...paths: string[]) {
    return this.$$.reduce(
      paths,
      (res: TRecordJson, path) => {
        this.$$.set(res, path, this.$$.get(this.$$store, path));
        return res;
      },
      <TRecordJson>{}
    );
  }
}
