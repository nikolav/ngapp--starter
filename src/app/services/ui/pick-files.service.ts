import { computed, inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { UseProccessMonitorService, UseUtilsService } from "../utils";
import { Observable } from "rxjs";
import { PickFileOptions } from "../../types";
import { TOKEN_windowDefaultView } from "../../keys";

@Injectable()
export class PickFilesService {
  private $$ = inject(UseUtilsService);
  private $ps = new UseProccessMonitorService();
  private document = inject(DOCUMENT);
  protected window = inject(TOKEN_windowDefaultView);
  //
  readonly processing = computed(() => Boolean(this.$ps.processing()));
  //
  private _isProgressive(opts: PickFileOptions = {}) {
    return !opts.directory && "showOpenFilePicker" in Object(this.window);
  }
  // #progressive
  private async _openProgressive(opts: PickFileOptions = {}) {
    const handles: FileSystemFileHandle[] = await (<any>(
      this.window
    )).showOpenFilePicker({
      multiple: Boolean(opts.multiple),
      types: opts.accept
        ? [
            {
              description: "Accepted",
              accept: this._acceptTypes(opts.accept),
            },
          ]
        : undefined,
      excludeAcceptAllOption: Boolean(opts.accept),
    });
    const files = await Promise.all(handles.map((h) => h.getFile()));
    return files;
  }
  // Fallback: hidden <input type="file">
  private _openFallback(opts: PickFileOptions = {}) {
    return new Promise<File[]>((resolve, reject) => {
      const input = this.document.createElement("input");
      input.type = "file";
      if (opts.accept) input.accept = opts.accept;
      if (opts.multiple) input.multiple = true;
      if (opts.capture) input.setAttribute("capture", opts.capture);
      if (opts.directory) (input as any).webkitdirectory = true; // non-standard

      // Important: append to DOM so iOS/Safari will open the picker reliably
      input.style.position = "fixed";
      input.style.left = "-9999px";
      this.document.body.appendChild(input);

      const clean = () => {
        input.removeEventListener("change", onChange);
        input.removeEventListener("cancel", onCancel as any);
        // defer
        setTimeout(() => this.document.body.removeChild(input));
      };

      const onChange = () => {
        const list = input.files;
        clean();
        // canceled|resolve
        resolve(this.$$.isEmpty(list) ? [] : Array.from(list!));
      };

      const onCancel = () => {
        clean();
        // user canceled
        resolve([]);
      };

      input.addEventListener("change", onChange);
      // Some browsers dispatch no "cancel"; change==null is our fallback
      input.addEventListener("cancel", onCancel as any);

      try {
        input.click();
      } catch (e) {
        clean();
        reject(e);
      }
    });
  }
  /**
   * Opens a file dialog and resolves with selected files.
   * Must be called from a user gesture (e.g., click handler).
   */
  open(opts: PickFileOptions = {}) {
    return new Observable<File[]>((observer) => {
      let files: File[] = [];
      (async () => {
        this.$ps.begin();
        try {
          files = this._isProgressive(opts)
            ? await this._openProgressive(opts)
            : await this._openFallback(opts);
        } catch (err: any) {
          if ("AbortError" === err?.name || 20 == err?.code) {
            // user cancel
            files = [];
          } else {
            this.$ps.setError(err);
          }
        } finally {
          setTimeout(() => {
            this.$ps.done(() => {
              observer.complete();
            });
          });
        }
        if (this.$ps.error()) {
          observer.error(this.$ps.error());
        } else {
          this.$ps.successful(() => {
            observer.next(files);
          });
        }
      })();
    });
  }

  // Helpers
  private _acceptTypes(accept: string) {
    // Convert HTML accept string to File System Access API shape.
    // "image/*,.pdf" -> { "image/*": [".*"], "application/pdf": [".pdf"] } (best-effort)
    const entries = accept
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const mimeMap: Record<string, string[]> = {};
    for (const e of entries) {
      if (e.includes("/")) {
        // MIME like "image/*" or "application/pdf"
        mimeMap[e] = ["."];
      } else if (e.startsWith(".")) {
        // Extension like ".csv"
        // Common guess for CSV; otherwise leave to browser
        mimeMap["application/octet-stream"] = (
          mimeMap["application/octet-stream"] || []
        ).concat(e);
      }
    }
    return mimeMap;
  }
}
