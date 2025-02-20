import { Component, OnInit, OnDestroy } from "@angular/core";

import { LayoutDefault } from "../../layouts";
// import { CommonMaterialModule } from "../../modules";

@Component({
  selector: "page-index",
  imports: [
    LayoutDefault,
    // CommonMaterialModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  ngOnInit() {}
  ngOnDestroy() {}
}
