import { Component, computed, input } from "@angular/core";

@Component({
  selector: "icon-loading",
  imports: [],
  templateUrl: "./icon-loading.component.html",
  styleUrl: "./icon-loading.component.scss",
})
export class IconLoadingComponent {
  size = input<any>("1em");
  width = input<number>(10);
  gap = input<number>(10);
  duration = input(4.1666);
  r = computed(() => Math.max(50 - this.width() / 2 - 1, 0));
  darray = computed(
    () => `${2 * Math.PI * this.r() - this.gap()} ${this.gap()}`
  );
  dur = computed(() => `${this.duration()}s`);
}
