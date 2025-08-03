import { Injectable, inject, signal } from "@angular/core";
import { EmitterService, AppConfigService } from "../../services";

@Injectable({
  providedIn: "root",
})
export class NotificationsRequestService {
  granted = signal<boolean>(false);

  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);

  constructor() {
    this.$emitter.subject.subscribe((evt) => {
      if (evt === this.$config.events.EVENT_APP_INIT) {
        this.request();
      }
    });
  }
  request() {
    Notification.requestPermission().then((permission_) => {
      this.granted.set("granted" == permission_);
    });
  }
}
