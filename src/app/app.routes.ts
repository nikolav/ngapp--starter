import { Routes } from '@angular/router';

import { PageApp, PageIndex } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: PageIndex,
  },
  {
    path: 'app',
    component: PageApp,
  },
];
