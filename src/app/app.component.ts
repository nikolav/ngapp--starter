import {
  Component,
  OnInit,
  Renderer2,
  computed,
  effect,
  inject,
} from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from "@angular/router";
import { DOCUMENT } from "@angular/common";

import { CoreModulesShared, MaterialSharedModule } from "./modules";
import {
  AppConfigService,
  UseUtilsService,
  LocalStorageService,
  CloudMessagingService,
} from "./services";
import { routeTransitionBlurInOut } from "./assets/route-transitions";
import { TOKEN_emitterNavigation } from "./keys";

@Component({
  selector: "app-root",
  imports: [CoreModulesShared, MaterialSharedModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
  animations: [routeTransitionBlurInOut],
})
export class AppComponent implements OnInit {
  private $renderer = inject(Renderer2);
  private $router = inject(Router);

  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $storage = inject(LocalStorageService);
  private $cm = inject(CloudMessagingService);

  private document = inject(DOCUMENT);
  private $emitterNavigation = inject(TOKEN_emitterNavigation);

  private appThemeIsDark = computed(() =>
    this.$$.parseBoolean(this.$storage.item(this.$config.key.APP_THEME_DARK))
  );

  constructor() {
    // toggle html.class @storage:push:[CLASS_APP_THEME_DARK]
    effect(() => {
      const classDark = this.$config.CLASS_APP_THEME_DARK;
      if (!this.appThemeIsDark()) {
        this.$renderer.removeClass(
          this.document.querySelector("html"),
          classDark
        );
      } else {
        this.$renderer.addClass(this.document.querySelector("html"), classDark);
      }
    });

    // @route:emit
    this.$router.events.subscribe((event) => {
      if (event instanceof NavigationStart)
        this.$emitterNavigation.next(
          this.$config.events.ROUTER_NAVIGATION_START
        );
      if (
        this.$$.some([
          event instanceof NavigationEnd,
          event instanceof NavigationCancel,
          event instanceof NavigationError,
        ])
      ) {
        this.$emitterNavigation.next(this.$config.events.ROUTER_NAVIGATION_END);
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
