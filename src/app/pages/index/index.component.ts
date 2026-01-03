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

import { AppConfigService, UseUtilsService } from "../../services";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $$ = inject(UseUtilsService);
  readonly $config = inject(AppConfigService);

  ok() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
