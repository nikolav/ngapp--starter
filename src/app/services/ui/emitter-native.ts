import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { fromEvent, merge, timer } from "rxjs";
import {
  filter,
  map,
  share,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators";

import type { IEventApp, TOrNoValue } from "../../types";
import { UseUtilsService } from "../utils";

export interface IOnContextConfig {
  // contextmenu only
  preventDefault?: boolean;
  // how long we wait to see if contextmenu arrives after pointerdown
  supressContextMs?: number;
  // suppress standalone contextmenu if a right pointerdown happened recently
  preferContextMs?: number;
}

@Injectable({
  providedIn: "root",
})
export class EventEmitterNativeService {
  static readonly DEFAULT_ON_CONTEXT_CONFIG = <IOnContextConfig>{
    preventDefault: false,
    supressContextMs: 250,
    preferMs: 122,
  };

  private readonly document = inject(DOCUMENT);

  private readonly $$ = inject(UseUtilsService);

  onContext(
    node: TOrNoValue<EventTarget> = null,
    config: IOnContextConfig = {}
  ) {
    const opts = this.$$.copy(
      {},
      EventEmitterNativeService.DEFAULT_ON_CONTEXT_CONFIG,
      config
    );
    const target = null != node ? node : this.document;

    const contextmenu$ = fromEvent<MouseEvent>(target, "contextmenu").pipe(
      share()
    );

    const rightPointerDown$ = fromEvent<PointerEvent>(
      target,
      "pointerdown"
    ).pipe(
      filter((e) => 2 == e.button),
      share()
    );

    // Track last right pointerdown time (for suppressing standalone contextmenu)
    const lastRightDownTs$ = rightPointerDown$.pipe(
      // get last ts of pd event
      map((pd) => pd.timeStamp),
      startWith(-Infinity),
      // cache one for future subscribers
      shareReplay({ bufferSize: 1, refCount: true })
    );

    /**
     * For each right pointerdown:
     * - prefer contextmenu if it arrives soon (<= preferMs) AND after this pointerdown
     * - else emit pointerdown after preferMs
     */
    const pairedIntent$ = rightPointerDown$.pipe(
      switchMap((pd) => {
        const pdTs = pd.timeStamp;

        // only contextmenu that happens AFTER this pointerdown
        // and within prefer window
        const preferContextmenu$ = contextmenu$.pipe(
          filter(
            (cm) =>
              cm.timeStamp >= pdTs &&
              cm.timeStamp - pdTs <= opts.preferContextMs!
          ),
          take(1),
          tap((cm) => {
            if (config.preventDefault) cm.preventDefault();
          })
        );

        const fallbackPointer$ = timer(opts.preferContextMs!).pipe(
          map(() => pd)
        );

        // If a matching contextmenu comes in time, it wins;
        // otherwise pointerdown fires after preferContextMs
        return merge(preferContextmenu$, fallbackPointer$).pipe(take(1));
      })
    );

    /**
     * Standalone contextmenu:
     * - allow long-press etc.
     * - but suppress if it likely belongs to a recent right pointerdown (duplicate emission)
     */
    const standaloneContextmenu$ = contextmenu$.pipe(
      withLatestFrom(lastRightDownTs$),
      filter(
        ([cm, lastPdTs]) => cm.timeStamp - lastPdTs > opts.supressContextMs!
      ),
      map(([cm]) => cm),
      tap((cm) => {
        if (config.preventDefault) cm.preventDefault();
      })
    );

    return merge(pairedIntent$, standaloneContextmenu$).pipe(
      map((event) => {
        return <IEventApp<MouseEvent | PointerEvent>>{
          type: event.type,
          payload: event,
        };
      })
    );
  }
}
