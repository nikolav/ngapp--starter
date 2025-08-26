import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule, PopperjsModule } from "../../modules";
import { IconLoading } from "../../components/icons";
import { ApolloStatusService } from "../../services";

@Component({
  selector: "page-index",
  imports: [
    IconLoading,
    JsonPipe,
    LayoutDefault,
    MaterialUIModule,
    PopperjsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./index.component.html",
  styleUrl: "./index.component.scss",
  providers: [],
})
export class IndexComponent implements OnInit, OnDestroy {
  $dStatus = inject(ApolloStatusService);
  constructor() {}
  ok() {}
  ngOnInit() {}
  ngOnDestroy() {}
}
//
