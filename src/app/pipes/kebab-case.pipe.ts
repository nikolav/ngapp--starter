import { Pipe, PipeTransform, inject } from "@angular/core";
import { UseUtilsService } from "../services";

@Pipe({
  name: "kebabCase",
})
export class KebabCasePipe implements PipeTransform {
  private $$ = inject(UseUtilsService);
  transform(value: any) {
    return this.$$.kebabCase(String(value));
  }
}
