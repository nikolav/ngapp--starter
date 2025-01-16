import { NgModule } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import { FooPipe, KebabCasePipe, StartCasePipe, DumpsPipe } from "../../pipes";

const PIPES = [AsyncPipe, FooPipe, KebabCasePipe, StartCasePipe, DumpsPipe];

@NgModule({
  // declarations: [],
  imports: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
