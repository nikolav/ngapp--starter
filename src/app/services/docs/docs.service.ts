import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from "@angular/core";
import { catchError, from, map, mergeMap, Observable, of, reduce } from "rxjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

//
import { db as firebaseFirestore } from "../../config/firebase";
import { StoreAuth } from "../../stores";
import { IDocsPatchInput, TOrNoValue } from "../../types";
import { UseUtilsService } from "../utils";

const withTimestamps = (node: any) => ({
  ...node,
  "@": serverTimestamp(),
});

@Injectable()
export class DocsService<T = any> implements OnDestroy {
  private readonly CONCURENCY = 10;
  private $$ = inject(UseUtilsService);
  private $auth = inject(StoreAuth);
  //
  readonly path = signal<TOrNoValue<string>>(undefined);
  readonly enabled = computed(() =>
    Boolean(this.path() && this.$auth.isAuth())
  );
  readonly data = signal<T[]>([]);
  //
  private coll = computed(() =>
    this.enabled() ? collection(firebaseFirestore, this.path()!) : null
  );
  private data_s: TOrNoValue<Unsubscribe>;
  //
  constructor() {
    effect((cleanup) => {
      if (!this.enabled()) return;
      this.start();
      cleanup(() => {
        this.destroy();
        this.data.set([]);
      });
    });
  }

  // @@
  commit(patches: IDocsPatchInput[]) {
    return this.enabled()
      ? from(patches).pipe(
          mergeMap(
            (patch) =>
              new Observable((obs) => {
                (async () => {
                  try {
                    const ID = this.$$.get(patch, "data.id");
                    const merge = this.$$.get(patch, "merge", true);
                    const dd = withTimestamps(
                      this.$$.omit(this.$$.get(patch, "data"), "id")
                    );
                    obs.next({
                      result: ID
                        ? await setDoc(doc(this.coll()!, ID), dd, {
                            merge,
                          })
                        : await addDoc(this.coll()!, dd),
                    });
                  } catch (error) {
                    obs.error(error);
                  }
                  obs.complete();
                })();
              }),
            this.CONCURENCY
          ),
          // pass error{}
          catchError((error) => of({ error })),
          // collect results
          reduce((acc, curr) => [...acc, curr], <any[]>[]),
          // format response
          map((result) => ({
            success: !this.$$.some(result, (node) =>
              this.$$.has(node, "error")
            ),
            result,
          }))
        )
      : this.$$.error$$();
  }

  // @@
  drop(...ids: any[]) {
    return this.enabled()
      ? from(ids).pipe(
          mergeMap(
            (ID) =>
              new Observable((obs) => {
                (async () => {
                  try {
                    obs.next({
                      result: await deleteDoc(
                        doc(firebaseFirestore, this.path()!, ID)
                      ),
                    });
                  } catch (error) {
                    obs.error(error);
                  }
                  obs.complete();
                })();
              }),
            this.CONCURENCY
          ),
          catchError((error) => of({ error })),
          reduce((acc, curr) => [...acc, curr], <any[]>[]),
          map((result) => ({
            success: !this.$$.some(result, (node) =>
              this.$$.hasOwn(node, "error")
            ),
            result,
          }))
        )
      : this.$$.error$$();
  }

  // @@
  use(path: string) {
    this.path.set(path);
    return this;
  }

  ngOnDestroy() {
    this.destroy();
  }

  protected destroy() {
    this.data_s?.();
  }

  protected start() {
    this.data_s = onSnapshot(this.coll()!, (snapshot) => {
      this.data.set(
        Array.from(snapshot.docs, (doc) => <T>{ ...doc.data(), id: doc.id })
      );
    });
  }
}
