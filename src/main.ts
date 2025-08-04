import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";

// // @@https --force
// //  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
// import { API_URL } from "./app/config/vars.env";
// if (API_URL.startsWith("https")) {
//   const meta = document.createElement("meta");
//   meta.httpEquiv = "Content-Security-Policy";
//   meta.content = "upgrade-insecure-requests";
//   document.head.appendChild(meta);
// }

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
