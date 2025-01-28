import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { LayoutDefault } from "../../layouts";
// import { DdemoDirective } from "../../directives/ddemo.directive";
import { CommonMaterialModule, PipeUtilsModule } from "../../modules";
import {
  AppConfigService,
  LocalStorageService,
  UseUtilsService,
} from "../../services";

@Component({
  selector: "app-demo",
  imports: [PipeUtilsModule, LayoutDefault, CommonMaterialModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $storage = inject(LocalStorageService);

  constructor() {
    effect(() => {
      console.log(this.$storage.data());
    });
  }

  ngOnInit() {
    console.log("@demo:ngOnInit");
  }
  ngOnDestroy() {}
}
