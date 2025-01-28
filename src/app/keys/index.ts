import { InjectionToken } from "@angular/core";

// @di tokens
export const TOKEN_foo = new InjectionToken<string>(
  "FOO:ed0d6051-4600-577d-af1f-e4844ce5b639"
);
export const TOKEN_localStorage = new InjectionToken<Storage>(
  "Storage:6090ec87-2fa3-514c-870f-2facbfb50ace",
  {
    providedIn: "root",
    factory: () => localStorage,
  }
);
