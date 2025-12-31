import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Observable } from "rxjs";

import { TOrNoValue } from "../../types";
import { AppConfigService, ManageSubscriptionsService } from "../utils";
import { TOKEN_windowDefaultView } from "../../keys";

@Injectable({
  providedIn: "root",
})
export class GmapsService {
  private document = inject(DOCUMENT);
  protected window = inject(TOKEN_windowDefaultView);

  private $config = inject(AppConfigService);
  private $sbs = new ManageSubscriptionsService();

  private readonly SCRIPT_ID = this.$config.services.google.maps.SCRIPT_ID;

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
      gmapsClientAvailable: new Observable<typeof google.maps>((obs) => {
        const maps = <typeof google.maps | undefined>(
          (<any>this.window).google.maps
        );
        if (maps) {
          obs.next(maps);
          obs.complete();
          return;
        }
        const node = this.document.getElementById(this.SCRIPT_ID);
        if (!node) {
          obs.error(
            new Error(`Google Maps script tag not found: #${this.SCRIPT_ID}`)
          );
          return;
        }

        const onLoad = () => {
          const maps_ = <typeof google.maps | undefined>(
            (<any>this.window).google.maps
          );
          if (maps_) {
            obs.next(maps_);
            obs.complete();
          } else {
            obs.error(
              new Error(
                "Google Maps script loaded, but window.google.maps is still unavailable."
              )
            );
          }
        };

        const onError = () => {
          obs.error(new Error("Failed to load Google Maps script."));
        };

        node.addEventListener("load", onLoad, { once: true });
        node.addEventListener("error", onError, { once: true });

        // Cleanup (important if subscriber unsubscribes early)
        return () => {
          node.removeEventListener("load", onLoad);
          node.removeEventListener("error", onError);
        };
      }).subscribe((gmapsClient) => {
        this.client.set(gmapsClient);
      }),
    });
  }
}
