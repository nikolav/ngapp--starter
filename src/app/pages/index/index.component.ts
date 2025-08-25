import { Component, OnInit, OnDestroy } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LayoutDefault } from "../../layouts";
import { MaterialUIModule, PopperjsModule } from "../../modules";
import { IconLoading } from "../../components/icons";

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
  ngOnInit() {}
  ngOnDestroy() {}
}
//
