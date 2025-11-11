import {
  computed,
  effect,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from "@angular/core";
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
import { Observable } from "rxjs";

//
import { db as firebaseFirestore } from "../../config/firebase";
import { StoreAuth } from "../../stores";
import { TOrNoValue } from "../../types";
import { UseUtilsService } from "../utils";

const withTimestamps = (node: any) => ({
  ...node,
  "@": serverTimestamp(),
});

@Injectable()
export class DocsService<T = any> implements OnDestroy {
  private $$ = inject(UseUtilsService);
  private $auth = inject(StoreAuth);
  //
  readonly path = signal<TOrNoValue<string>>(null);
  readonly enabled = computed(() => null != this.path() && this.$auth.isAuth());
  readonly data = signal<T[]>([]);
  //
  private coll = computed(() =>
    this.enabled() ? collection(firebaseFirestore, this.path()!) : null
  );
  private data_s: TOrNoValue<Unsubscribe>;
  //
  constructor() {
    effect((onCleanup) => {
      if (!this.enabled()) return;
      this.start();
      onCleanup(() => {
        this.destroy();
      });
    });
  }
  //
  commit(patch: any, merge = true) {
    return new Observable((observer) => {
      (async () => {
        try {
          if (!this.enabled()) throw "DocsService:disabled";
          const ID = this.$$.get(patch, "id", "");
          const dd = withTimestamps(patch);
          observer.next(
            ID
              ? await setDoc(doc(this.coll()!, ID), this.$$.omit(dd, "id"), {
                  merge,
                })
              : await addDoc(this.coll()!, dd)
          );
        } catch (error) {
          observer.error(error);
        } finally {
          observer.complete();
        }
      })();
    });
  }
  drop(...ids: string[]) {
    return new Observable((observer) => {
      (async () => {
        try {
          if (!this.enabled()) throw "DocsService:disabled";
          observer.next(
            await Promise.all(
              ids.map((id) =>
                deleteDoc(doc(firebaseFirestore, this.path()!, id))
              )
            )
          );
        } catch (error) {
          observer.error(error);
        } finally {
          observer.complete();
        }
      })();
    });
  }
  start() {
    this.data_s = onSnapshot(this.coll()!, (snapshot) => {
      this.data.set(
        Array.from(snapshot.docs, (doc) => <T>{ ...doc.data(), id: doc.id })
      );
    });
  }
  use(path: string) {
    this.path.set(path);
    return this;
  }
  destroy() {
    this.data_s?.();
    this.data.set([]);
  }
  ngOnDestroy() {
    this.destroy();
  }
}
