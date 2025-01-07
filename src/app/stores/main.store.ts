import { Injectable, inject } from '@angular/core';

import { UseUtilsService } from '../services';
//
@Injectable({
  providedIn: 'root',
})
export class StoreMain {
  private $$: UseUtilsService = inject(UseUtilsService);
  $$store = <any>{};
  push(patch: any) {
    this.$$.each(patch, (value, path) => {
      this.$$.set(this.$$store, path, value);
    });
  }
  pull(...paths: string[]) {
    return this.$$.reduce(
      paths,
      (res: any, path) => {
        this.$$.set(res, path, this.$$.get(this.$$store, path));
        return res;
      },
      <any>{}
    );
  }
}
