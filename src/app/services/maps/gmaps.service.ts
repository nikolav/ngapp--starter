import { computed, effect, Injectable, signal } from "@angular/core";
import { timer } from "rxjs";
import { takeWhile } from "rxjs/operators";

import { TOrNoValue } from "../../types";
import { ManageSubscriptionsService } from "../utils";

@Injectable({
  providedIn: "root",
})
export class GmapsService {
  private $sbs = new ManageSubscriptionsService();

  // @@
  readonly client = signal<TOrNoValue<typeof google.maps>>(null);
  // @@
  readonly enabled = computed(() => null != (this.client()?.version ?? null));

  constructor() {
    effect((cleanup) => {
      if (!this.enabled()) {
        this.start();
      }
      cleanup(() => {
        this.$sbs.destroy();
      });
    });
  }

  protected start() {
    this.$sbs.push({
      gmapsReady: timer(0, 50)
        .pipe(takeWhile(() => !window.google?.maps, true))
        .subscribe(() => {
          if (window.google?.maps) {
            this.client.set(window.google.maps);
          }
        }),
    });
  }
}
