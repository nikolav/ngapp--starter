import { computed, inject, Injectable, Signal, signal } from "@angular/core";

import { UseUtilsService } from "../services";

type TTrackedSignalsMap = Record<any, Signal<any>>;

@Injectable()
export class UseIsProcessingService {
  private $$ = inject(UseUtilsService);
  private tracked = signal<TTrackedSignalsMap>({});
  isActive = computed(() =>
    this.$$.some(this.tracked(), (sig, _field) => sig())
  );
  watch(sig: Signal<any>, field?: any) {
    this.tracked.update((s) =>
      this.$$.assign({}, s, { [field ?? this.$$.uuid()]: sig })
    );
  }
  unwatch(...fields: any[]) {
    this.tracked.set(this.$$.omit(this.tracked(), fields));
  }
  unwatchAll() {
    this.tracked.set(<TTrackedSignalsMap>{});
  }
}
