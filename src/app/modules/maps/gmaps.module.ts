import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";

import { GmapsService } from "../../services/maps";

@NgModule({
  // declarations: [],
  imports: [GoogleMapsModule],
  exports: [GoogleMapsModule],
  providers: [GmapsService],
})
export class GMapsModule {}
