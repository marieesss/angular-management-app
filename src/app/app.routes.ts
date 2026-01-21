import { Routes } from '@angular/router';
import {Register} from './features/auth/register/register';
import {Login} from './features/auth/login/login';
import {TaskList} from './features/task/task-list/task-list';
import {authGuard} from './core/auth/guards/auth-guard';
import {TaskForm} from './features/task/task-form/task-form';
import { TaskDetail } from './features/task/task-detail/task-detail';

export const routes: Routes = [
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: 'tasks', component: TaskList, canActivate: [authGuard]},
  {path: 'create', component: TaskForm, canActivate: [authGuard]},
  {path: 'update/:id', component: TaskForm, canActivate: [authGuard]},
  {path: 'detail/:id', component: TaskDetail, canActivate: [authGuard]},
  {path: '', redirectTo: '/tasks', pathMatch: 'full'}
];
