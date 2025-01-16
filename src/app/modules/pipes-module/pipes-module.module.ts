import { NgModule } from "@angular/core";

import { FooPipe, KebabCasePipe, StartCasePipe } from "../../pipes";

const PIPES = [FooPipe, KebabCasePipe, StartCasePipe];

@NgModule({
  // declarations: [],
  imports: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
