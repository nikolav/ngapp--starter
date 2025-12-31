import { computed, inject, Injectable, Signal, signal } from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable()
export class UseIsProcessingService {
  protected $$ = inject(UseUtilsService);

  protected trackSignals = signal<Signal<any>[]>([]);

  // @@
  readonly processing = computed(() =>
    this.$$.some(this.trackSignals(), (sig) => sig())
  );

  // @@
  watch(...signals: Signal<any>[]) {
    this.trackSignals.update((ws) => Array.from(new Set([...ws, ...signals])));
  }

  // @@
  unwatch(...signals: Signal<any>[]) {
    this.trackSignals.update((s) => this.$$.without(s, ...signals));
  }

  // @@
  destroy() {
    this.trackSignals.set([]);
  }
}
