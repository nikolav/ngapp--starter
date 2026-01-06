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

import { UseUtilsService } from "../../services";

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
  host: {
    class: "app-container-reset",
  },
})
export class IndexComponent implements OnInit, OnDestroy {
  readonly $$ = inject(UseUtilsService);

  ok(event: any) {}
  ngOnInit() {}
  ngOnDestroy() {}
}
