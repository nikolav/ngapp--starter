import { Routes } from "@angular/router";

import { PageApp, PageIndex, PageNotFound, PageDemo } from "./pages";
// import { AuthGuard, FooDeactivateGuard } from "./middleware/guards";

export const routes: Routes = [
  {
    path: "",
    component: PageIndex,
    // title: 'home'
    pathMatch: "full",
    data: { animation: "PageIndex" },
  },
  {
    path: "demo",
    component: PageDemo,
    data: { animation: "PageDemo" },
  },
  {
    path: "app",
    component: PageApp,
    data: { animation: "PageApp" },
    // protect route access
    // canActivate: [AuthGuard],
    // canDeactivate: [FooDeactivateGuard],
    // data: {
    //   FOO: "BAR",
    // },
    // protect child routes access
    // canActivateChild: [AuthGuard],
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
    data: { animation: "PageNotFound" },
  },
  {
    path: "**",
    redirectTo: "/not-found",
  },
];
