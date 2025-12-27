import { Component, OnInit, OnDestroy } from "@angular/core";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { PopupConnectedComponent } from "../../components/app";
import { HostElementDirective } from "../../directives";
import { triggerVisibleHiddenFadeSlide } from "../../assets/animations";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    PopupConnectedComponent,
    HostElementDirective,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  animations: [triggerVisibleHiddenFadeSlide({ name: "fadeSlideUp" })],
})
export class IndexComponent implements OnInit, OnDestroy {
  ok() {
    console.log("ok");
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
