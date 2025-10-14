import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { UseUtilsService } from "../services";

@Injectable()
export class UseIsProcessingService {
  private $$ = inject(UseUtilsService);
  private tracked = signal<Signal<any>[]>([]);

  readonly isActive = computed(() =>
    this.$$.some(this.tracked(), (sig) => sig())
  );

  watch(...signals: Signal<any>[]) {
    this.tracked.update((s) => [...s, ...signals]);
  }
  unwatch(...signals: Signal<any>[]) {
    this.tracked.update((s) => this.$$.without(s, ...signals));
  }
  destroy() {
    this.tracked.set([]);
  }
}
