import { effect, Injectable, OnDestroy, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DemoService implements OnDestroy {
  readonly enabled = signal(true);
  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      onCleanup(() => {
        this.destroy();
      });
    });
  }
  start() {}
  destroy() {}
  ngOnDestroy() {
    this.destroy();
  }
}
