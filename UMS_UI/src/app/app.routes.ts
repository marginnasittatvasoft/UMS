import { Routes } from '@angular/router';
import { AddEditUserComponent } from './features/users/components/add-edit-user/add-edit-user.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: "Ums/user",
        pathMatch: 'full'
    },
    {
        path: 'Ums/user',
        loadComponent: () => import('./features/users/components/user/user.component').then(m => m.UserComponent)
    },
    {
        path: 'Ums/adduser',
        loadComponent: () => import('./features/users/components/add-edit-user/add-edit-user.component').then(m => m.AddEditUserComponent)
    },
    {
        path: '**',
        redirectTo: 'Ums/user',
        pathMatch: 'full',
    }


];
