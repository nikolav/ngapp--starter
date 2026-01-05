import { Component, OnInit } from "@angular/core";
import { MaterialSharedModule } from "../../modules";
import { LayoutDefault } from "../../layouts";

@Component({
  selector: "page-not-found",
  imports: [MaterialSharedModule, LayoutDefault],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
  host: {
    class: "app-container-reset",
  },
})
export class NotFoundComponent implements OnInit {
  ngOnInit() {
    // pass
  }
}
