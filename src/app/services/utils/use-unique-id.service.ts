import { Injectable, inject, signal } from "@angular/core";

import { UseUtilsService } from "../../services";
import type { TOrNoValue } from "../../types";

@Injectable({
  providedIn: "root",
})
export class UseUniqueIdService {
  protected $$ = inject(UseUtilsService);
  protected prefix: string;

  // @@
  ID = signal<TOrNoValue<string>>(undefined);

  constructor() {
    this.prefix = `${this.$$.idGen()}:`;
  }

  // @@
  next() {
    this.ID.set(this.idgen());
  }

  protected idgen() {
    return this.$$.uniqueId(this.prefix);
  }
}
