import { Routes } from '@angular/router';
import { AddEditUserComponent } from './core/components/add-edit-user/add-edit-user.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: "Ums/user",
        pathMatch: 'full'
    },
    {
        path: 'Ums/user',
        loadComponent: () => import('./core/components/user/user.component').then(m => m.UserComponent)
    },
    {
        path: 'Ums/adduser',
        loadComponent: () => import('./core/components/add-edit-user/add-edit-user.component').then(m => m.AddEditUserComponent)
    },
    {
        path: '**',
        redirectTo: 'Ums/user',
        pathMatch: 'full',
    }


];
