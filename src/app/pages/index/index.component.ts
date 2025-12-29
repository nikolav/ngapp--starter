import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { JsonPipe } from "@angular/common";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { LocalCacheDirective, SelectableItemDirective } from "../../directives";
import { UseUtilsService } from "../../services";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    SelectableItemDirective,
    LocalCacheDirective,
    JsonPipe,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent implements OnInit, OnDestroy {
  protected $$ = inject(UseUtilsService);

  ok(dd: LocalCacheDirective) {
    dd.cache.push({ foo: this.$$.uuid() });
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
