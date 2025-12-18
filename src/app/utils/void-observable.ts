import { Observable, of } from "rxjs";

export const empty$$ = () =>
  new Observable((observer) => {
    observer.complete();
  });

export const null$$ = () => of(null);
