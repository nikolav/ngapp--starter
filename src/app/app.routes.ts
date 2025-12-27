import { Routes } from "@angular/router";

import { PageIndex } from "./pages";

export const routes: Routes = [
  {
    path: "",
    component: PageIndex,
    // title: 'home'
    pathMatch: "full",
    data: { key: "0c05141c-0c3b-5d37-8fc0-800d479810e2" },
  },
  {
    path: "**",
    redirectTo: "/",
  },
];
