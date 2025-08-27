import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import { ApolloStatusService, LocalStorageService } from "../../services";
import { StoreAuth } from "../../stores";

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
  $storage = inject(LocalStorageService);
  constructor() {}
  ok() {
    this.$storage.push({ "foo.bar": `d:${Date.now()}`, baz: Math.random() });
  }
  ok2() {
    this.$storage.drop("baz");
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
//
