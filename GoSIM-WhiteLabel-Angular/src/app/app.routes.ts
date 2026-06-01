import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () => import('./views/search/search.component').then(m => m.SearchViewComponent)
  },
  {
    path: 'packages/:code',
    loadComponent: () => import('./views/packages-list/packages-list.component').then(m => m.PackagesListComponent)
  },
  {
    path: 'status/:id',
    loadComponent: () => import('./views/status/status.component').then(m => m.StatusViewComponent)
  },
  { path: '**', redirectTo: '/search' }
];
