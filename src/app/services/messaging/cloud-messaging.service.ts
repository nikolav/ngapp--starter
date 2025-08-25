import { Injectable, signal, inject, computed, effect } from "@angular/core";
import {
  // onMessage,
  getMessaging,
  getToken,
  isSupported as messagingIsSupported,
} from "firebase/messaging";
import type { Messaging } from "firebase/messaging";
import { onMessage } from "@angular/fire/messaging";
import { Observable } from "rxjs";

import { NotificationsRequestService } from "./notifications-request.service";
import { StoreAuth } from "../../stores";
import { VAPID_KEY } from "../../config";
import { app as firebaseApp } from "../../config/firebase";
import { UseUtilsService, AppConfigService } from "../../services";
import { TOrNoValue } from "../../types";

@Injectable({
  providedIn: "root",
})
export class CloudMessagingService {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $auth = inject(StoreAuth);
  private $notifications = inject(NotificationsRequestService);
  private $client = signal<TOrNoValue<Messaging>>(null);

  private tokensFCM = computed(() =>
    this.$$.get(
      this.$auth.profile(),
      this.$config.key.CLOUD_MESSAGING_TOKENS,
      {}
    )
  );
  private service_ready = computed(
    () =>
      null != this.$client() &&
      this.$notifications.granted() &&
      this.$auth.isAuth()
  );

  message = signal<TOrNoValue<Observable<any>>>(null);

  constructor() {
    // setup service
    (async () => {
      if (!(await messagingIsSupported())) {
        throw Error("firebase cloud messaging not supported.");
      }
      const service = getMessaging(firebaseApp);
      this.$client.set(service);
    })();
    // setup fcm-token
    effect(async () => {
      if (!this.service_ready()) return;
      const tokenClientFCM = await getToken(this.$client()!, {
        vapidKey: VAPID_KEY,
      });
      if (!this.$$.has(this.tokensFCM(), tokenClientFCM)) {
        await this.$auth.profilePatch({
          [this.$config.key.CLOUD_MESSAGING_TOKENS]: { [tokenClientFCM]: true },
        });
      }
    });
    // handle foreground messages
    effect(() => {
      const client = this.$client();
      if (!client) return;
      if (!this.message()) {
        this.message.set(
          new Observable((sub) =>
            onMessage(client, (msg) => {
              sub.next(msg);
            })
          )
        );
      }
    });
  }
}
