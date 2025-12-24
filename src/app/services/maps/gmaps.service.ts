import { effect, Injectable, signal } from "@angular/core";
import { Observable, timer } from "rxjs";
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

  constructor() {
    effect((cleanup) => {
      if (!this.client()) {
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
        .pipe(
          takeWhile(() => !window.google?.maps, true)
          // filter(() => !!window.google?.maps),
          // take(1)
        )
        .subscribe(() => {
          if (window.google?.maps) {
            this.client.set(window.google.maps);
          }
        }),
    });
  }
}
