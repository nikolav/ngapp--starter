import { Component, input } from "@angular/core";

@Component({
  selector: "icon-buildings",
  imports: [],
  templateUrl: "./icon-buildings.component.html",
})
export class IconBuildingsComponent {
  size = input<any>("1em");
}
