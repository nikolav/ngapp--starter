import { Injectable, signal, inject, computed } from "@angular/core";
import type { TOrNoValue } from "../../types";
import { UseUtilsService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class DocsCollectionService<T = any> {
  private $$ = inject(UseUtilsService);
  //
  topic = signal("");
  docs = signal<TOrNoValue<T[]>>(undefined);
  //
  commit() {}
  drop() {}
  reload() {}
}
