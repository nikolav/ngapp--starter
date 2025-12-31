import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  effect,
  ChangeDetectionStrategy,
} from "@angular/core";
import { catchError } from "rxjs/operators";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";

import {
  ManageSubscriptionsService,
  UseCacheKeyService,
  UseUtilsService,
} from "../../services";

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
  protected $$ = inject(UseUtilsService);

  protected $s = new ManageSubscriptionsService();
  readonly $cacheMain = new UseCacheKeyService().use("main");

  constructor() {
    effect(() => {
      this.$s.push({
        mainIO: this.$cacheMain
          .io()
          .pipe(catchError(() => this.$$.empty$$()))
          .subscribe(() => {
            this.$cacheMain.reload().subscribe();
          }),
      });
    });
  }

  ok() {
    this.$cacheMain
      .commit({ foo: this.$$.idGen(), bar: this.$$.idGen() })
      .subscribe();
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.$s.destroy();
  }
}
