import { effect, inject, Injectable, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root",
})
export class UsePageTitleService {
  private $title = inject(Title);
  readonly title = signal("🌎 page");

  constructor() {
    effect(() => {
      this.$title.setTitle(this.title());
    });
  }
}
