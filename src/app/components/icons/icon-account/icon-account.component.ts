import { Component, input } from "@angular/core";

@Component({
  selector: "icon-account",
  templateUrl: "./icon-account.component.html",
})
export class IconAccount {
  size = input<any>("1em");
}
