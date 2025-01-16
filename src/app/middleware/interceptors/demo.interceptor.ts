import {
  HttpInterceptorFn,
  // HttpEventType
} from "@angular/common/http";
// import { tap } from "rxjs/operators";

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  // runs for *requests
  console.log("@interceptor:demo", { req });
  return next(req);
  // # access .response:event
  // .pipe(
  //   tap((event) => {
  //     if (HttpEventType.Response !== event.type) return;
  //     console.log({ event });
  //   })
  // )
};
