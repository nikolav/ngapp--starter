import { Component, input } from "@angular/core";

@Component({
  selector: "icon-cart-outline",
  imports: [],
  templateUrl: "./icon-cart-outline.component.html",
  styleUrl: "./icon-cart-outline.component.scss",
})
export class IconCartOutlineComponent {
  size = input<any>("1em");
}
