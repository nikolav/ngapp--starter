import { NgModule } from "@angular/core";
import { AsyncPipe, JsonPipe } from "@angular/common";

import {
  AppendFooPipe,
  KebabCasePipe,
  StartCasePipe,
  // DumpsPipe,
} from "../../pipes";

const PIPES = [
  AppendFooPipe,
  KebabCasePipe,
  StartCasePipe,
  // DumpsPipe,
  //
  AsyncPipe,
  JsonPipe,
];

@NgModule({
  // declarations: [],
  imports: [...PIPES],
  exports: [...PIPES],
})
export class PipesModule {}
