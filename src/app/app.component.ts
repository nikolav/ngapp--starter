import { Component, OnInit, inject } from "@angular/core";
import { RouterModule } from "@angular/router";

import { CommonMaterialModule } from "./modules";
import { EmitterService, AppConfigService } from "./services";

import { io } from "socket.io-client";
import { IO_SERVER } from "./config";

@Component({
  selector: "app-root",
  imports: [RouterModule, CommonMaterialModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [],
})
export class AppComponent implements OnInit {
  private $emitter = inject(EmitterService);
  private $config = inject(AppConfigService);

  socket = io(IO_SERVER, { withCredentials: true });

  ngOnInit() {
    console.log("@debug:ngOnInit --app.component");
    // @next:init
    setTimeout(() =>
      this.$emitter.subject.next(this.$config.events.EVENT_APP_INIT)
    );
    console.log({ socket: this.socket });
  }
}
