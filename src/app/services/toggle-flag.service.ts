import { Injectable, signal } from "@angular/core";
import { type TOrNoValue } from "../types";

@Injectable()
export class ToggleFlagService {
  isActive = signal(false);
  toggle(flag?: TOrNoValue<boolean>) {
    this.isActive.update((value) => (null == flag ? !value : flag));
  }
  on() {
    this.toggle(true);
  }
  off() {
    this.toggle(false);
  }
  // @init set state
  use(flag: boolean) {
    this.isActive.set(flag);
    return this;
  }
}
