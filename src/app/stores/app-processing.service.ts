import {
  computed,
  Injectable,
  signal,
  inject,
  type Signal,
} from "@angular/core";

import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class AppProcessingService {
  protected $$ = inject(UseUtilsService);

  protected watchSignals = signal<Signal<any>[]>([]);

  // @@
  readonly processing = computed(() =>
    this.$$.some(this.watchSignals(), (sig) => sig())
  );

  // @@
  watch(...signals: Signal<any>[]) {
    this.watchSignals.update((ws) => Array.from(new Set([...ws, ...signals])));
  }

  // @@
  unwatch(...signals: Signal<any>[]) {
    this.watchSignals.update((ws) => this.$$.without(ws, ...signals));
  }

  // @@
  destroy() {
    this.watchSignals.set([]);
  }
}
