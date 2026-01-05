import { Component, OnInit, computed, effect, inject } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from "@angular/router";

import { CoreModulesShared, MaterialSharedModule } from "./modules";
import {
  AppConfigService,
  UseUtilsService,
  LocalStorageService,
  CloudMessagingService,
  UseDomAccessService,
} from "./services";
import { routeTransitionBlurInOut } from "./assets/route-transitions";
import { TOKEN_emitterNavigation } from "./keys";

@Component({
  selector: "app-root",
  imports: [CoreModulesShared, MaterialSharedModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
  host: {
    class: "app-container-reset *block *h-full",
  },
  animations: [routeTransitionBlurInOut],
})
export class AppComponent implements OnInit {
  private $router = inject(Router);

  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $storage = inject(LocalStorageService);
  private $cm = inject(CloudMessagingService);
  private $emitterNavigation = inject(TOKEN_emitterNavigation);
  private $c = inject(UseDomAccessService);

  private appThemeIsDark = computed(() =>
    this.$$.parseBoolean(this.$storage.item(this.$config.key.APP_THEME_DARK))
  );

  constructor() {
    // toggle html.class @storage:push:[CLASS_APP_THEME_DARK]
    effect((cleanup) => {
      const sbs = this.$c.class
        .push("html", {
          [this.$config.CLASS_APP_THEME_DARK]: this.appThemeIsDark(),
        })
        .subscribe();
      cleanup(() => {
        sbs.unsubscribe();
      });
    });

    // @route:emit
    this.$router.events.subscribe((event) => {
      if (event instanceof NavigationStart)
        this.$emitterNavigation.next({
          type: this.$config.events.ROUTER_NAVIGATION_START,
          payload: null,
        });
      if (
        this.$$.some([
          event instanceof NavigationEnd,
          event instanceof NavigationCancel,
          event instanceof NavigationError,
        ])
      ) {
        this.$emitterNavigation.next({
          type: this.$config.events.ROUTER_NAVIGATION_END,
          payload: null,
        });
      }
    });

    // @cloud-messaging onMessage --debug
    this.$cm.messages.subscribe((payload) => {
      console.log("@debug cloud-messaging", { payload });
    });
  }

  // @@
  routeTransitionPrepareOutlet(outlet: RouterOutlet) {
    return this.$$.get(outlet, "activatedRouteData.key", "--DEFAULT--");
  }

  //
  ngOnInit() {}
}
