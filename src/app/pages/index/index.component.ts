import { Component, OnInit, OnDestroy, inject, effect } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { GoogleMapsModule } from "@angular/google-maps";

import {
  IconxModule,
  MaterialSharedModule,
  CoreModulesShared,
} from "../../modules";
import { LayoutDefault } from "../../layouts";
import { CleanupService, DocService, GmapsService } from "../../services";

@Component({
  selector: "page-index",
  imports: [
    CoreModulesShared,
    MaterialSharedModule,
    LayoutDefault,
    IconxModule,
    JsonPipe,
    GoogleMapsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
})
export class IndexComponent implements OnInit, OnDestroy {
  private $cleanup = new CleanupService();
  readonly $d = DocService.init("d:QaHsmyoiFWcWZ4Dlt");

  readonly $gmaps = inject(GmapsService);
  center: google.maps.LatLngLiteral = { lat: 44.7866, lng: 20.4489 };

  constructor() {
    effect(() => {
      if (this.$gmaps.enabled()) {
        console.log({ $gmaps: this.$gmaps.client() });
      }
    });
  }

  runCleanup() {
    this.$cleanup.reset();
    this.$cleanup.task(() => {
      console.log(0);
    });
    this.$cleanup.task(async () => {
      // throw "err:1";
      return console.log(1);
    });

    this.$cleanup.run().subscribe((res) => {
      console.log({ res });
    });
  }

  ok() {
    this.$d
      .commit({
        "x:1": Math.random(),
        "x:2": Math.random(),
      })
      .subscribe((res) => {
        console.log({ res });
      });
    // this.$d.drop("x:2").subscribe((res) => console.log({ res }));
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.runCleanup();
  }
}
