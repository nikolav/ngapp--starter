import { Injectable } from '@angular/core';
import { type TOrNoValue } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ToggleFlagService {
  isActive = false;
  toggle(flag?: TOrNoValue<boolean>) {
    this.isActive = null == flag ? !this.isActive : flag;
  }
  on() {
    this.toggle(true);
  }
  off() {
    this.toggle(false);
  }
}
