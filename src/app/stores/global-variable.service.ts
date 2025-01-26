import { Injectable, inject } from "@angular/core";
import { StoreMain } from "./main.store";
import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class GlobalVariableService {
  private $$ = inject(UseUtilsService);
  private $main = inject(StoreMain);

  exists(field: any) {
    return this.$$.coreHasOwn(this.$main.store, field);
  }
  key(name: any) {
    return this.$main.pull(name)[name];
  }
  commit(name: any, value: any) {
    this.$main.push({ [name]: value });
  }
}
