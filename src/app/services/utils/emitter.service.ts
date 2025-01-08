import { Injectable } from "@angular/core";
import EE from "eventemitter3";

@Injectable({
  providedIn: "root",
})
export class EmitterService {
  private _emitter = new EE();
  handle(callback: (ee: EE) => void) {
    callback(this._emitter);
  }
}
