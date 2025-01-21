import {
  computed,
  Injectable,
  signal,
  inject,
  type Signal,
} from "@angular/core";
import { UseUtilsService } from "../services";

@Injectable({
  providedIn: "root",
})
export class AppProcessingService {
  private $$ = inject(UseUtilsService);

  private watched_ = signal<Signal<any>[]>([]);

  processing = computed(() => this.$$.some(this.watched_(), (sig) => sig()));
  watch(...nodes: Signal<any>[]) {
    this.watched_.set([...this.watched_(), ...nodes]);
  }
  unwatch() {
    this.watched_.set([]);
  }
}
