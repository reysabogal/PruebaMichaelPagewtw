import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { TaskComponent } from './task/task';
import { UserComponent } from './user/user';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'tareas', pathMatch: 'full' },
      { path: 'tareas', component: TaskComponent },
      { path: 'usuarios', component: UserComponent },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
