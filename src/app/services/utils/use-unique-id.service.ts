import { Injectable, inject, signal } from "@angular/core";
import { UseUtilsService } from "../../services";
import type { TOrNoValue } from "../../types";

@Injectable()
export class UseUniqueIdService {
  private $$ = inject(UseUtilsService);

  private prefix: string;
  ID = signal<TOrNoValue<string>>(null);

  constructor() {
    this.prefix = `${this.$$.idGen()}:`;
  }

  private idgen() {
    return this.$$.uniqueId(this.prefix);
  }

  next() {
    this.ID.set(this.idgen());
  }
}
