import { Observable, throwError } from "rxjs";

export const error$ = <T = never>(error?: unknown): Observable<T> => {
  return throwError(() => error);
};
