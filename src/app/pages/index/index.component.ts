import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import { ApolloStatusService } from "../../services";
import { StoreAuth, StoreGravatars } from "../../stores";

@Component({
  selector: "page-index",
  imports: [
    IconLoading,
    JsonPipe,
    LayoutDefault,
    MaterialUIModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $dStatus = inject(ApolloStatusService);
  $auth = inject(StoreAuth);
  $gg = inject(StoreGravatars);

  ok() {
    this.$gg.refresh();
  }
  ok2() {
    if (this.$gg.enabled()) {
      this.$gg.disable();
    } else {
      this.$gg.enable();
    }
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
//
