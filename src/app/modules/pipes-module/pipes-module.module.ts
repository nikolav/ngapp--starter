import { NgModule } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import {
  AppendFooPipe,
  KebabCasePipe,
  StartCasePipe,
  DumpsPipe,
} from "../../pipes";

const PIPES = [
  AsyncPipe,
  AppendFooPipe,
  KebabCasePipe,
  StartCasePipe,
  DumpsPipe,
];

@NgModule({
  // declarations: [],
  imports: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
