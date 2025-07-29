import { Component, OnInit } from "@angular/core";
import { MaterialUIModule } from "../../modules";
import { LayoutDefault } from "../../layouts";

@Component({
  selector: "page-not-found",
  imports: [MaterialUIModule, LayoutDefault],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent implements OnInit {
  ngOnInit() {
    // pass
  }
}
