import { Injectable, signal, inject, computed, effect } from "@angular/core";
import { Observable } from "rxjs";
import {
  onMessage,
  getMessaging,
  getToken,
  isSupported as messagingIsSupported,
  // deleteToken as deleteFCMToken,
} from "firebase/messaging";
import type { Messaging } from "firebase/messaging";

import { StoreAuth } from "../../stores";
import { NotificationsRequestService } from "./notifications-request.service";
import { UseUtilsService, AppConfigService } from "../../services";
import { app as firebaseApp } from "../../config/firebase";
import { TOrNoValue } from "../../types";
import { VAPID_KEY } from "../../config";

//##
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
  private serviceAvailable = computed(
    () =>
      null != this.$client() &&
      this.$notifications.granted() &&
      // this.$auth.isAuth()
      this.$auth.isAuthApi()
  );

  messages = signal<TOrNoValue<Observable<any>>>(null);

  constructor() {
    // 1) setup client messaging
    (async () => {
      try {
        if (!(await messagingIsSupported())) {
          throw Error(
            "Firebase Cloud Messaging is not supported in this browser."
          );
        }
        const service = getMessaging(firebaseApp);
        this.$client.set(service);
      } catch (error) {
        // pass
      }
    })();

    // 2) fetch/persist FCM token whenever service becomes ready
    effect(() => {
      if (!this.serviceAvailable()) return;

      // don’t block the effect; run async work inside
      (async () => {
        const tokenClientFCM = await getToken(this.$client()!, {
          vapidKey: VAPID_KEY,
        });

        // user may have blocked notifications
        if (!tokenClientFCM) return;

        // save fcm-token
        if (!this.$$.has(this.tokensFCM(), tokenClientFCM)) {
          await this.$auth.profilePatch({
            [this.$config.key.CLOUD_MESSAGING_TOKENS]: {
              [tokenClientFCM]: true,
            },
          });
        }
      })();
    });

    // 3) Provide foreground messages stream once client exists
    effect(() => {
      if (null != this.messages()) return;
      if (null == this.$client()) return;
      this.messages.set(
        new Observable((observer) =>
          onMessage(this.$client()!, (payload) => {
            observer.next(payload);
          })
        )
      );
    });

    // 4) Cleanup token on logout or permission revoked
    // effect(() => {
    //   const client = this.$client();
    //   const isAuth = this.$auth.isAuth();
    //   const granted = this.$notifications.granted();

    //   if (!client) return;

    //   // If user logged out or permission is no longer granted, try deleting known tokens
    //   if (!isAuth || !granted) {
    //     (async () => {
    //       try {
    //         // Best effort: delete any known tokens for this device
    //         // (If you store multiple per device, keep track and iterate them.)
    //         await deleteFCMToken(client);
    //       } catch {
    //         // pass
    //       }
    //     })();
    //   }
    // });
  }
  // # Optional helper: call when you want to force-refresh the token
  // async refreshToken() {
  //   let token: TOrNoValue<string>;
  //   if (this.serviceAvailable()) {
  //     const client = this.$client()!;

  //     token = await getToken(client, {
  //       vapidKey: VAPID_KEY,
  //     });

  //     if (token && !this.$$.has(this.tokensFCM(), token)) {
  //       await this.$auth.profilePatch({
  //         [this.$config.key.CLOUD_MESSAGING_TOKENS]: { [token]: true },
  //       });
  //     }
  //   }
  //   return token;
  // }
}
