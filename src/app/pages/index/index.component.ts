import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";

import { LayoutDefault } from "../../layouts";
import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";

import {
  UseUniqueIdService,
  UseUtilsService,
} from "../../services";
import { AnimateCssDirective } from "../../directives";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    AnimateCssDirective,
  ],
  providers: [UseUniqueIdService],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "app-container-reset",
  },
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $$ = inject(UseUtilsService);
  readonly $id = inject(UseUniqueIdService);

  ok() {
    console.log("ok");
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
