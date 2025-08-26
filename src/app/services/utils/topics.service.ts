import { Injectable, inject } from "@angular/core";
import { AppConfigService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class TopicsService {
  private $config = inject(AppConfigService);
  authProfile(uid?: any) {
    return uid ? `${this.$config.key.AUTH_PROFILE}${uid}` : "";
  }
  collectionsIoEventChanges(topic?: any) {
    return topic
      ? `${this.$config.io.IOEVENT_COLLECTIONS_UPSERT_prefix}${topic}`
      : "";
  }
  ioEventOnCache(cache_key?: any) {
    return cache_key
      ? `${this.$config.io.IOEVENT_REDIS_CACHE_KEY_UPDATED_prefix}${cache_key}`
      : "";
  }
  collectionsIoDocsUpdated(topic?: any) {
    return top ? `${this.$config.key.COLLECTIONS_DOCS_UPDATED}${topic}` : "";
  }
}
