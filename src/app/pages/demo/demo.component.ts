import { Component, effect, inject, OnDestroy, OnInit } from "@angular/core";
import { LayoutDefault } from "../../layouts";
// import { DdemoDirective } from "../../directives/ddemo.directive";
import { CommonMaterialModule } from "../../modules";
import { AppConfigService, UseCacheKeyService } from "../../services";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, CommonMaterialModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  private $config = inject(AppConfigService);

  $ccAppConfigRemote = new UseCacheKeyService().use(
    this.$config.key.KEY_APP_REMOTE_CONFIG
  );

  constructor() {
    effect(() => {
      console.log("@cache:appConfigRemote");
      console.log(this.$ccAppConfigRemote.data());
    });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.$ccAppConfigRemote.destroy();
  }
}
