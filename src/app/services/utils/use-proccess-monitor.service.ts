import { Injectable, inject, signal } from "@angular/core";

import { UseUtilsService } from "../../services";
import type { TOrNoValue } from "../../types";

@Injectable()
export class UseProccessMonitorService {
  private $$ = inject(UseUtilsService);

  readonly processing = signal<TOrNoValue<boolean>>(null);
  readonly error = signal<TOrNoValue<any>>(null);
  readonly success = signal<TOrNoValue<boolean>>(null);

  begin(callback: any = this.$$.noop) {
    this.error.set(null);
    this.success.set(false);
    this.processing.set(true);
    callback();
  }
  setError(error: unknown) {
    this.error.set(error);
  }
  successful(callback: any = this.$$.noop) {
    this.success.set(true);
    callback();
  }
  done(callback: any = this.$$.noop) {
    this.processing.set(false);
    callback();
  }
}
