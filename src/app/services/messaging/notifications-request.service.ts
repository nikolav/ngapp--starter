import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NotificationsRequestService {
  granted = signal(false);

  constructor() {
    this.request();
  }
  request() {
    Notification.requestPermission().then((permission_) => {
      this.granted.set("granted" == permission_);
    });
  }
}
