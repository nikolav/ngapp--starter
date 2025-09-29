import { Component, OnDestroy, OnInit } from "@angular/core";
import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, MaterialUIModule, RouterModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
