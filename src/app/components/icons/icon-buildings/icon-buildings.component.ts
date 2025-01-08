import { Component, Input } from "@angular/core";

@Component({
  selector: "icon-buildings",
  imports: [],
  templateUrl: "./icon-buildings.component.html",
})
export class IconBuildingsComponent {
  @Input() size: any = "1em";
}
