import { computed, inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { StoreAuth } from "../../../stores";
import { AppConfigService } from "../../utils";
import {
  M_viberChannelSetupChannelsDrop,
  M_viberChannelSetupSetWebhook,
  M_viberSendTextMessage,
  M_viberSendPictureMessage,
} from "../../../graphql";

@Injectable({
  providedIn: "root",
})
export class ViberChannelsService {
  protected $config = inject(AppConfigService);
  protected $auth = inject(StoreAuth);
  protected $apollo = inject(Apollo);

  readonly enabled = computed(() => this.$auth.isAuthApi());

  // viberSendTextMessage(payload: JsonData!): JsonData!
  text(messages: Record<string, string>) {
    return this.enabled()
      ? this.$apollo.mutate({
          mutation: M_viberSendTextMessage,
          variables: { payload: messages },
        })
      : undefined;
  }
  // viberSendPictureMessage(payload: JsonData!): JsonData!
  picture(
    pictureMessages: Record<
      string,
      { media: string; text?: string; thumbnail?: string }
    >
  ) {
    return this.enabled()
      ? this.$apollo.mutate({
          mutation: M_viberSendPictureMessage,
          variables: { payload: pictureMessages },
        })
      : undefined;
  }
  // viberChannelSetupSetWebhook(url: String!, auth_token: String!, is_global: Boolean): JsonData!
  init(name: string, auth_token: string, is_global = false) {
    return this.enabled()
      ? this.$apollo.mutate({
          mutation: M_viberChannelSetupSetWebhook,
          variables: {
            url: this.$config.viber.webhook_url(name),
            auth_token,
            is_global,
          },
        })
      : undefined;
  }
  // viberChannelSetupChannelsDrop(channels: [String!]): JsonData!
  drop(...channels: string[]) {
    return this.enabled()
      ? this.$apollo.mutate({
          mutation: M_viberChannelSetupChannelsDrop,
          variables: {
            channels,
          },
        })
      : undefined;
  }
}
