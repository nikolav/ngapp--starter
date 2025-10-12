import { inject, Injectable } from "@angular/core";
import { Howl } from "howler";
import type { HowlOptions } from "howler";

import { AppConfigService, UseUtilsService } from "../utils";

@Injectable({
  providedIn: "root",
})
export class SoundsService {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);

  readonly sounds: Record<string, Howl> = {};

  init(track: string, options: HowlOptions) {
    if (this.initialized(track)) return;
    const options_ = this.$$.assign(
      {},
      this.$config.audio.howl.defaults,
      options
    );
    this.sounds[track] = new Howl(options_);
  }
  initialized(track: string) {
    return null != this.sounds[track];
  }
  isPlaying(track: string) {
    return this.sounds[track]?.playing() ?? false;
  }
  access(track: string, callback: (howl: Howl) => void) {
    return this.initialized(track) ? callback(this.sounds[track]!) : undefined;
  }
  play(track: string) {
    return this.isPlaying(track)
      ? undefined
      : this.access(track, (howl) => {
          howl.play();
        });
  }
  each(callback: (howl: Howl, track: string) => void) {
    this.$$.each(this.sounds, callback);
  }
  destroy(track: string) {
    this.access(track, (howl) => {
      howl.stop();
      howl.unload();
    });
    delete this.sounds[track];
  }
}
