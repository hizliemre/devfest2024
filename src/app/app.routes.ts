import {Routes} from '@angular/router';
import {LayoutComponent} from '@layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todos',
    pathMatch: 'full'
  },
  {
    path: 'todos',
    component: LayoutComponent,
    loadChildren: () => import('@pages/todos/todos.component').then(m => m.routes)
  }
];
