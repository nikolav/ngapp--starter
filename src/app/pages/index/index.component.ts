import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { HostElementDirective } from "../../directives";
import { triggerVisibleHiddenFadeSlide } from "../../assets/animations";
import { PopupConnectedComponent } from "../../components/app";
import { DemoComponent } from "../../components/dev";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    PopupConnectedComponent,
    HostElementDirective,
    DemoComponent,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  animations: [triggerVisibleHiddenFadeSlide({ name: "fadeSlideUp" })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy {
  ok() {
    console.log("ok");
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
