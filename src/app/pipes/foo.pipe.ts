import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "append_foo",
})
export class FooPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    //
    return `${value}:foo`;
  }
}
