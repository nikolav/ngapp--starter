import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { LayoutDefault } from "../../layouts";
// import { DdemoDirective } from "../../directives/ddemo.directive";
import { CommonMaterialModule, PipeUtilsModule } from "../../modules";
import { AppConfigService } from "../../services";

@Component({
  selector: "app-demo",
  imports: [PipeUtilsModule, LayoutDefault, CommonMaterialModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  private $config = inject(AppConfigService);

  ngOnInit() {}
  ngOnDestroy() {}
}
