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
  private $messaging = signal<TOrNoValue<Messaging>>(null);

  private tokensFCM = computed(() =>
    this.$$.get(
      this.$auth.profile(),
      this.$config.key.CLOUD_MESSAGING_TOKENS,
      {}
    )
  );
  private service_initialized = computed(
    () =>
      null != this.$messaging() &&
      this.$notifications.granted() &&
      this.$auth.isAuth()
  );

  message = signal<TOrNoValue<Observable<any>>>(null);

  constructor() {
    messagingIsSupported().then((isSupported) => {
      if (!isSupported) {
        throw Error("firebase cloud messaging not supported.");
      }
      const service = getMessaging(firebaseApp);
      this.$messaging.set(service);
    });
    effect(async () => {
      if (!this.service_initialized()) return;
      const tokenClientFCM = await getToken(this.$messaging()!, {
        vapidKey: VAPID_KEY,
      });
      if (!this.$$.has(this.tokensFCM(), tokenClientFCM)) {
        await this.$auth.profilePatch({
          [this.$config.key.CLOUD_MESSAGING_TOKENS]: { [tokenClientFCM]: true },
        });
      }
    });
    effect(() => {
      const client = this.$messaging();
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
