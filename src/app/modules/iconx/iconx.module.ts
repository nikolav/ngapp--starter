import { NgModule } from "@angular/core";

import { IconAccount, IconBuildings } from "../../components/icons";

const ICONS = [IconAccount, IconBuildings];

@NgModule({
  // declarations: [],
  imports: [...ICONS],
  exports: [...ICONS],
})
export class IconxModule {}
