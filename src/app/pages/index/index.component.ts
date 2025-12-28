import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { PopupConnectedComponent } from "../../components/app";
import { HostElementDirective } from "../../directives";
import { triggerVisibleHiddenFadeSlide } from "../../assets/animations";
import { UseDisplayService } from "../../services";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy {
  $display = inject(UseDisplayService);
  ok() {
    console.log("ok");
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
