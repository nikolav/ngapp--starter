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
  animations: [triggerVisibleHiddenFadeSlide({ name: "fadeSlideUp" })],
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $$ = inject(UseUtilsService);
  readonly $popups = inject(PopupDetachedService);

  readonly $vcr = inject(ViewContainerRef);

  private Popup1 = viewChild("popup1", { read: TemplateRef });

  ok() {
    this.$popups
      .open({
        popup1: {
          target: this.Popup1()!,
          overlayOptions: {
            centered: true,
            fullscreen: true,
            // size: { width: 320 },
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
