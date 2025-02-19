import { Component, OnInit, OnDestroy } from "@angular/core";

import { LayoutDefault } from "../../layouts";

@Component({
  selector: "page-index",
  imports: [LayoutDefault],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
