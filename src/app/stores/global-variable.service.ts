import { Injectable, inject } from "@angular/core";
import { StoreMain } from "./main.store";
import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class GlobalVariableService {
  private $$: UseUtilsService = inject(UseUtilsService);
  private $$main: StoreMain = inject(StoreMain);

  exists(name: any) {
    return this.$$.coreHasOwn(this.$$main.$$store, name);
  }
  key(name: any) {
    return this.$$main.pull(name)[name];
  }
  commit(name: any, value: any) {
    this.$$main.push({ [name]: value });
  }
}
