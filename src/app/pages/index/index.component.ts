import { Component, OnInit, OnDestroy } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialUIModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  ngOnInit() {}
  ngOnDestroy() {}
}
//
