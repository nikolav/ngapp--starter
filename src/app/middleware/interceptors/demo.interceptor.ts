import { HttpInterceptorFn, HttpEventType } from "@angular/common/http";
import { tap } from "rxjs/operators";

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  // runs for *requests
  console.log("@debug --demoInterceptor --logRequestInterceptor");
  console.log(req);
  // # can send modified request
  //  req_mod = req.clone({..fields});

  return next(req).pipe(
    // # access .response:event
    tap((event) => {
      if (HttpEventType.Response !== event.type) return;
      console.log("@debug --demoInterceptor --logResponseInterceptor");
      console.log(event);
    })
  );
};
