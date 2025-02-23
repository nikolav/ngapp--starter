import { Component, OnInit, OnDestroy } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { CommonMaterialModule } from "../../modules";
import { DdemoDirective } from "../../directives";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, CommonMaterialModule, DdemoDirective],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
