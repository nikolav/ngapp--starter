import { Injectable, signal, inject, computed, effect } from "@angular/core";
import { catchError, Subject, of as oOf, from as oFrom } from "rxjs";
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

  private deviceToken = signal<TOrNoValue<string>>(undefined);
  private tokensFCM = computed(() =>
    this.$$.get(this.$auth.profile(), this.$config.key.CLOUD_MESSAGING_TOKENS)
  );
  private serviceAvailable = computed(
    () =>
      null != this.$client() &&
      this.$notifications.granted() &&
      this.$auth.isAuthApi()
  );

  readonly messages = new Subject<any>();

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
        // ignore
      }
    })();

    // 2) fetch FCM token whenever service becomes ready
    effect(() => {
      if (!this.serviceAvailable()) return;
      oFrom(getToken(this.$client()!, { vapidKey: VAPID_KEY }))
        .pipe(catchError(() => oOf(undefined)))
        .subscribe((tokenClientFCM) => {
          this.deviceToken.set(tokenClientFCM);
        });
    });

    // 3) persist fcm device token
    // @fcm-token && @tokens:
    //   check if fcm-token exists
    effect(() => {
      if (
        !this.serviceAvailable() ||
        !(this.deviceToken() && this.tokensFCM()) ||
        this.deviceToken()! in this.tokensFCM()
      )
        return;
      this.$auth
        .profilePatch({
          [this.$config.key.CLOUD_MESSAGING_TOKENS]: {
            [this.deviceToken()!]: true,
          },
        })
        .pipe(catchError(() => oOf(undefined)))
        .subscribe();
    });

    // 4) Provide foreground messages stream once client exists
    effect((onCleanup) => {
      if (!this.serviceAvailable()) return;
      const unsubscribe = onMessage(this.$client()!, (payload) => {
        this.messages.next(payload);
      });
      onCleanup(unsubscribe);
    });

    // 5) Cleanup token on logout or permission revoked
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

  //     if (token && !this.$$.hasOwn(this.tokensFCM(), token)) {
  //       await this.$auth.profilePatch({
  //         [this.$config.key.CLOUD_MESSAGING_TOKENS]: { [token]: true },
  //       });
  //     }
  //   }
  //   return token;
  // }
}
