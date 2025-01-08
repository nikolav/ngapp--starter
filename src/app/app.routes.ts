import { Routes } from "@angular/router";

import { PageApp, PageIndex, PageNotFound } from "./pages";

export const routes: Routes = [
  {
    path: "",
    component: PageIndex,
    // title: 'home'
  },
  {
    path: "app",
    component: PageApp,
  },
  // {
  //   path: "assets",
  //   component: Foo,
  //   children: [
  //     {
  //       path: ":id",
  //       component: Bar,
  //     },
  //     {
  //       path: ":id/edit",
  //       component: Baz,
  //     },
  //   ],
  // },
  {
    path: "not-found",
    component: PageNotFound,
  },
  {
    path: "**",
    redirectTo: "/not-found",
  },
];
