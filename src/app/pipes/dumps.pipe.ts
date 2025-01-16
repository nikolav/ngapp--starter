import { Pipe, PipeTransform, inject } from "@angular/core";
import { UseUtilsService } from "../services";

@Pipe({
  name: "dumps",
})
export class DumpsPipe implements PipeTransform {
  private $$ = inject(UseUtilsService);

  transform(value: unknown) {
    return this.$$.dumpJson(value);
  }
}
