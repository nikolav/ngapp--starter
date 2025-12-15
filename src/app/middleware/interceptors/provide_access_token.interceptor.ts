// auth.interceptor.ts
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { StoreAuth } from "../../stores";
import { TOKEN_DEFAULT } from "../../config";
import { AppConfigService } from "../../services";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const $config = inject(AppConfigService);

  // check skip attach Authorization; @s3 etc.
  if ($config.re.SKIP_AUTHORIZATION_TOKEN_URLS.some((re) => re.test(req.url)))
    return next(req);

  const $auth = inject(StoreAuth); // OK: interceptors are DI contexts
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${$auth.access_token() ?? TOKEN_DEFAULT}`,
    },
  });

  return next(authReq);
};
