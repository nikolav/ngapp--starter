import { Injectable, inject } from "@angular/core";
import { AppConfigService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class TopicsService {
  private $config = inject(AppConfigService);
  authProfile(uid?: any) {
    return uid ? `${this.$config.key.KEY_AUTH_PROFILE}${uid}` : "";
  }
  collectionsIoEventChanges(topic?: any) {
    return topic
      ? `${this.$config.io.IOEVENT_COLLECTIONS_UPSERT_prefix}${topic}`
      : "";
  }
}
