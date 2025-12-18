import { Observable, of } from "rxjs";

export const empty$$ = () =>
  new Observable<never>((obs) => {
    obs.complete();
  });

export const null$$ = () => of(null);
