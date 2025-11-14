import { Component, OnInit, OnDestroy } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialSharedModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  constructor() {}

  ok() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
//
