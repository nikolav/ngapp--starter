import { Injectable, inject, signal } from "@angular/core";
import type { TOrNoValue } from "../../types";
import { UseUtilsService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class UseProccessMonitorService {
  private $$ = inject(UseUtilsService);

  processing = signal<TOrNoValue<boolean>>(null);
  error = signal<TOrNoValue<any>>(null);
  success = signal<TOrNoValue<boolean>>(null);

  // constructor() {}
  begin(callback: any = this.$$.noop) {
    this.error.set(null);
    this.success.set(false);
    this.processing.set(true);
    callback();
  }
  done(callback: any = this.$$.noop) {
    this.processing.set(false);
    callback();
  }
  setError(error: any) {
    this.error.set(error);
  }
  successful(callback: any = this.$$.noop) {
    this.success.set(true);
    callback();
  }
}
