import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { RouterModule } from "@angular/router";
import { AudioService } from "../../services/audio";

@Component({
  selector: "app-demo",
  imports: [LayoutDefault, MaterialUIModule, RouterModule],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, OnInit {
  readonly $audio = inject(AudioService);
  constructor() {
    this.$audio.init("demo", { src: ["/sample-track.mp3"] });
  }

  ngOnInit() {}
  ngOnDestroy() {}
}
