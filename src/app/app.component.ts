import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from "@angular/router";

import { MaterialUIModule } from "./modules";
import { EmitterService, AppConfigService, UseUtilsService } from "./services";
import { StoreFlags } from "./stores";

@Component({
  selector: "app-root",
  imports: [CommonModule, RouterModule, MaterialUIModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  private $router = inject(Router);
  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);

  // toggle sidenav flags
  readonly KEY_FLAGS = this.$config.key.CACHE_KEY_STORE_FLAGS;
  readonly $flags = inject(StoreFlags);

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
    console.log("@debug app.component:ngOnInit");
    // @next:init:emit
    setTimeout(() =>
      this.$emitter.subject.next(this.$config.events.EVENT_APP_INIT)
    );
  }
}
