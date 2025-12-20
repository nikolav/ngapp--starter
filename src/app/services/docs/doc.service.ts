import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import {
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

import { db as dbFirestore } from "../../config/firebase";
import { StoreAuth } from "../../stores";
import {
  AppConfigService,
  ManageSubscriptionsService,
  UseUtilsService,
} from "../utils";
import { TOrNoValue, TRecordJson } from "../../types";
import { schemaFirestoreDocPath } from "../../schemas";

@Injectable()
export class DocService {
  private readonly CONCURENCY = 10;

  private $$ = inject(UseUtilsService);
  private $auth = inject(StoreAuth);
  private $config = inject(AppConfigService);
  private $sbs = new ManageSubscriptionsService();

  protected ID = signal<TOrNoValue<string>>(undefined);

  readonly data = signal<TOrNoValue<TRecordJson>>(undefined);
  readonly enabled = computed(() => Boolean(this.ID() && this.$auth.isAuth()));

  protected readonly docRef = computed(() =>
    this.enabled()
      ? doc(dbFirestore, this.$config.services.firebase.doc.CACHE, this.ID()!)
      : null
  );
  protected data_s: TOrNoValue<Unsubscribe>;

  constructor() {
    // sync/cleanup data @enabled
    effect((cleanup) => {
      if (!this.enabled()) return;
      this.start();
      cleanup(() => {
        this.destroy();
        this.data.set(null);
      });
    });
  }

  // @@
  commit(patch: TOrNoValue<TRecordJson>, merge = true) {
    return this.enabled() && (merge ? !this.$$.isEmpty(patch) : patch)
      ? new Observable((obs) => {
          (async () => {
            try {
              obs.next({
                result: await setDoc(this.docRef()!, withTimestamps(patch), {
                  merge,
                }),
              });
            } catch (error) {
              obs.error(error);
            }
          })();
        }).pipe(catchError((error) => of({ error })))
      : this.$$.error$$({ error: "DocService service/input error" });
  }

  // @@
  drop(...fields: string[]) {
    return this.enabled() && !this.$$.isEmpty(fields)
      ? new Observable((obs) => {
          (async () => {
            try {
              obs.next({
                result: await updateDoc(
                  this.docRef()!,
                  this.$$.reduce(
                    fields,
                    (acc, field) => {
                      acc[field] = deleteField();
                      return acc;
                    },
                    withTimestamps(<any>{})
                  )
                ),
              });
            } catch (error) {
              obs.error(error);
            }
          })();
        }).pipe(catchError((error) => of({ error })))
      : this.$$.error$$({ error: "DocService service/input error" });
  }

  // ##
  protected use(TOKEN: string) {
    this.ID.set(schemaFirestoreDocPath.parse(TOKEN));
    return this;
  }

  // ##
  protected start() {
    this.$sbs.push({
      data: new Observable((obs) => {
        this.data_s = onSnapshot(
          this.docRef()!,
          (snapshot) => {
            obs.next(snapshot);
          },
          (error) => {
            obs.next(error);
          }
        );
      })
        .pipe(
          catchError((error) => {
            // @debug:error
            console.log("@debug error DocService");
            console.error(error);

            return this.$$.empty$$();
          }),
          mergeMap(
            (snapshot: any) =>
              snapshot.exists()
                ? of({ ...snapshot.data(), id: snapshot.id })
                : new Observable((obs) => {
                    (async (newd) => {
                      try {
                        await setDoc(this.docRef()!, newd);
                        obs.next({ ...newd, id: this.ID() });
                      } catch (error) {
                        obs.error(error);
                      }
                    })(withTimestamps({}));
                  }),
            this.CONCURENCY
          ),
          catchError(this.$$.empty$$)
        )
        .subscribe((dd) => {
          this.data.set(dd);
        }),
    });
  }

  // ##
  protected destroy() {
    this.$sbs.destroy();
    this.data_s?.();
  }

  // @@
  static init(TOKEN: string) {
    return new DocService().use(TOKEN);
  }
}

//
// --utils
function withTimestamps(node: any) {
  return {
    ...node,
    "@": serverTimestamp(),
  };
}
