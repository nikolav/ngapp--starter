import { inject, Injectable } from "@angular/core";
import { Howl } from "howler";
import type { HowlOptions } from "howler";

import { AppConfigService, UseUtilsService } from "../utils";
import { TOrNoValue } from "../../types";

@Injectable({
  providedIn: "root",
})
export class SoundsService {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);

  readonly sounds: Record<string, TOrNoValue<Howl>> = {};

  init(track: string, options: HowlOptions) {
    const options_ = this.$$.assign(
      {},
      this.$config.audio.howl.defaults,
      options
    );
    this.sounds[track] = new Howl(options_);
  }
  hasTrack(track: string) {
    return null != this.sounds[track];
  }
  isPlaying(track: string) {
    return this.sounds[track]?.playing() ?? false;
  }
  play(track: string) {
    return this.isPlaying(track) ? undefined : this.sounds[track]?.play();
  }
}
