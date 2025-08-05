import { Component, computed, input } from "@angular/core";

@Component({
  selector: "icon-loading",
  imports: [],
  templateUrl: "./icon-loading.component.html",
  styleUrl: "./icon-loading.component.scss",
})
export class IconLoadingComponent {
  // ##imports
  // ##config:const
  // ##config ##props ##route ##attrs ##form-fields
  size = input<any>("1em");
  width = input(10);
  gap = input(10);
  duration = input(4.1666);
  // ##schemas
  // ##utils
  // ##icons
  // ##refs ##flags ##models
  // ##data ##auth ##state
  // ##computed
  r = computed(() => Math.max(50 - this.width() / 2 - 1, 0));
  darray = computed(
    () => `${2 * Math.PI * this.r() - this.gap()} ${this.gap()}`
  );
  dur = computed(() => `${this.duration()}s`);
  // ##forms ##handlers ##helpers ##small-utils
  // ##watch
  // ##hooks ##lifecycle
  // ##head ##meta
  // useHead({ title: "" });
  // ##provide
  // ##io
}
