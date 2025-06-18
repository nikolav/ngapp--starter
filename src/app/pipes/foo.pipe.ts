import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "appendFoo",
})
export class AppendFooPipe implements PipeTransform {
  transform(value: any) {
    return `FOO: --${value}--`;
  }
}
