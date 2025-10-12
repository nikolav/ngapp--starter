// auth.interceptor.ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { StoreAuth } from "../../stores";
import { TOKEN_DEFAULT } from "../../config";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const $auth = inject(StoreAuth); // OK: interceptors are DI contexts
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${$auth.access_token() ?? TOKEN_DEFAULT}`,
    },
  });

  return next(authReq);
};
