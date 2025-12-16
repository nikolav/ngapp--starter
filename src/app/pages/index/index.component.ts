import { Component, OnInit, OnDestroy, inject } from "@angular/core";

import { LayoutDefault } from "../../layouts";
import { IconxModule, MaterialSharedModule } from "../../modules";
import {
  LocalStorageService,
  // UseUtilsService,
} from "../../services";

@Component({
  selector: "page-index",
  imports: [LayoutDefault, MaterialSharedModule, IconxModule],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  private $localStorage = inject(LocalStorageService);

  ok() {
    this.$localStorage.push({
      x1: Math.random(),
    });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
