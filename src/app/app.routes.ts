import { Routes } from "@angular/router";

import { PageApp, PageIndex, PageNotFound, PageDemo } from "./pages";
import {
  AuthGuard,
  // FooDeactivateGuard
} from "./middleware/guards";

export const routes: Routes = [
  {
    path: "",
    component: PageIndex,
    // title: 'home'
    // pathMatch: "full",
  },
  {
    path: "demo",
    component: PageDemo,
  },
  {
    path: "app",
    component: PageApp,
    // protect route access
    canActivate: [AuthGuard],
    // protect child routes access
    canActivateChild: [AuthGuard],
    // protect route leave
    // canDeactivate: [FooDeactivateGuard],
    // data: {
    //   foo: "bar",
    // },
    // resolve: { foo: FooResolver },
  },
  // {
  //   path: "assets",
  //   component: Foo,
  //   canActivateChild: [AuthGuard],
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
