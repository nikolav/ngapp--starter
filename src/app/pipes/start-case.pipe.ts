import { Pipe, PipeTransform, inject } from "@angular/core";
import { UseUtilsService } from "../services";

@Pipe({
  name: "startCase",
})
export class StartCasePipe implements PipeTransform {
  private $$ = inject(UseUtilsService);
  transform(value: any) {
    return this.$$.startCase(String(value));
  }
}
