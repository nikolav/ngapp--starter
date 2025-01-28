import { Component, OnInit, inject } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from "@angular/router";

import { CommonMaterialModule } from "./modules";
import { EmitterService, AppConfigService, UseUtilsService } from "./services";

@Component({
  selector: "app-root",
  imports: [RouterModule, CommonMaterialModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  private $$ = inject(UseUtilsService);
  private $emitter = inject(EmitterService);
  private $config = inject(AppConfigService);
  private $router = inject(Router);

  constructor() {
    this.$router.events.subscribe((event) => {
      // @route-change:emit
      if (event instanceof NavigationStart)
        this.$emitter.subject.next(this.$config.events.ROUTER_NAVIGATION_START);
      if (
        this.$$.some([
          event instanceof NavigationEnd,
          event instanceof NavigationCancel,
          event instanceof NavigationError,
        ])
      )
        this.$emitter.subject.next(this.$config.events.ROUTER_NAVIGATION_END);
    });
  }
  ngOnInit() {
    console.log("@debug:ngOnInit --app.component");
    // @next:init:emit
    setTimeout(() =>
      this.$emitter.subject.next(this.$config.events.EVENT_APP_INIT)
    );
  }
}
