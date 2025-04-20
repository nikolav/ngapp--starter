import { Component, OnInit } from "@angular/core";
import { CommonMaterialModule } from "../../modules";
import { LayoutDefault } from "../../layouts";

@Component({
  selector: "page-not-found",
  imports: [CommonMaterialModule, LayoutDefault],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent implements OnInit {
  ngOnInit() {
    // pass
  }
}
