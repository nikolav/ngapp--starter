import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";

import {
  CoreModulesShared,
  IconxModule,
  MaterialSharedModule,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { StoreAuth } from "../../stores";
import { UseUtilsService } from "../../services";

@Component({
  selector: "page-app",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  readonly $$ = inject(UseUtilsService);
  readonly $auth = inject(StoreAuth);
  readonly idToken = computed(() => this.$auth.account()?.getIdToken());
  //
  ngOnInit() {}
  ngOnDestroy() {}
}
