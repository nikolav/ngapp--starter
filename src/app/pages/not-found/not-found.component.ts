import { Component, inject, computed, OnInit } from "@angular/core";
import { CommonMaterialModule } from "../../modules";

@Component({
  selector: "page-not-found",
  imports: [CommonMaterialModule],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss",
})
export class NotFoundComponent implements OnInit {
  ngOnInit(): void {
    // pass
  }
}
