import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  viewChild,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";

import { PopupDetachedService, UseUtilsService } from "../../services";
import { triggerVisibleHiddenFadeSlide } from "../../assets/animations/fade-slide.vh-trigger";
import { AppFocusCapturedComponent } from "../../components/app";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    AppFocusCapturedComponent,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    triggerVisibleHiddenFadeSlide({
      name: "fadeSlideUp",
    }),
  ],
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $vcr = inject(ViewContainerRef);

  readonly $$ = inject(UseUtilsService);
  readonly $popup = inject(PopupDetachedService);

  private tPopup1 = viewChild("popup1", { read: TemplateRef });

  ok() {
    this.$popup
      .open({
        popup1: {
          target: this.tPopup1()!,
          overlayOptions: {
            // centered: true,
            // fullscreen: true,
            // point: { x: 122, y: 200 },
            size: { width: 320, height: "100vh" },
            top: 0,
            right: 0,
            // closeOnEscape: true,
            // hasBackdrop: true,
            // closeOnBackdropClick: true,
          },
          factoryOptions: {
            viewContainerRef: this.$vcr,
          },
        },
      })
      .subscribe((res) => {
        console.log({ res });
      });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
