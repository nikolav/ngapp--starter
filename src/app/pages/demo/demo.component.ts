import { Component, OnDestroy, OnInit } from "@angular/core";
import { LayoutDefault } from "../../layouts";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
