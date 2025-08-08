// # https://github.com/tonysamperi/ngx-popperjs
import { NgModule } from "@angular/core";
import { NgxPopperjsModule } from "ngx-popperjs";

import { PopperjsConfig } from "../../config";

const MODULE = [NgxPopperjsModule.forRoot(PopperjsConfig)];

@NgModule({
  imports: [MODULE],
  exports: [MODULE],
})
export class PopperjsModule {}
