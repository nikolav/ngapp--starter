import {
  Component,
  OnInit,
  Renderer2,
  computed,
  effect,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
  RouterOutlet,
} from "@angular/router";

import { MaterialSharedModule } from "./modules";
import {
  EmitterService,
  AppConfigService,
  UseUtilsService,
  LocalStorageService,
  CloudMessagingService,
} from "./services";
import { StoreFlags } from "./stores";
import { routeTransitionBlurInOut } from "./assets/route-transitions";

@Component({
  selector: "app-root",
  imports: [CommonModule, RouterModule, MaterialSharedModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
  animations: [routeTransitionBlurInOut],
})
export class AppComponent implements OnInit {
  private $router = inject(Router);
  private $renderer = inject(Renderer2);

  private $$ = inject(UseUtilsService);
  private $config = inject(AppConfigService);
  private $emitter = inject(EmitterService);
  private $storage = inject(LocalStorageService);

  private $cm = inject(CloudMessagingService);

  // toggle sidenav flags
  readonly isActiveSidenav = this.$config.key.IS_ACTIVE_APP_SIDENAV;
  readonly $flags = inject(StoreFlags);
  // #theme
  private appThemeDark_ = computed(() =>
    String(this.$storage.item(this.$config.key.APP_THEME_DARK) || "")
  );

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
    // toggle html.class @storage:push:[CLASS_APP_THEME_DARK]
    effect(() => {
      const clsDark = this.$config.CLASS_APP_THEME_DARK;
      if (!this.appThemeDark_()) {
        this.$renderer.removeClass(document.querySelector("html"), clsDark);
      } else {
        this.$renderer.addClass(document.querySelector("html"), clsDark);
      }
    });

    // @cloud-messaging onMessage --emit
    this.$cm.messages.subscribe((payload) => {
      // debug
      console.log("@debug cloud-messaging", { payload });
      // emitter next --global
      this.$emitter.subject.next({
        type: this.$config.events.EVENT_CLOUDMESSAGING_ONMESSAGE,
        payload,
      });
    });
  }
  ngOnInit() {
    console.log("@debug app.component:ngOnInit");
    // @next:init:emit
    setTimeout(() =>
      this.$emitter.subject.next(this.$config.events.EVENT_APP_INIT)
    );
  }
  routeTransitionPrepareOutlet(outlet: RouterOutlet) {
    return this.$$.get(outlet, "activatedRouteData.animation", "--DEFAULT--");
  }
}
