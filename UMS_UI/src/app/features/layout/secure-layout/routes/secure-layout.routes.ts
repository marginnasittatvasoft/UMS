import { Routes } from "@angular/router";
import { authGuard } from "../../../../core/auth/auth.guard";

export const SecureRoutes: Routes = [
    {
        path: '',
        redirectTo: "login",
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../../public-layout/component/login-page/login-page.component').then(m => m.LoginPageComponent)
    },
    {
        path: 'Ums', children: [
            {
                path: 'user',
                loadComponent: () => import('../../../users/components/user/user.component').then(m => m.UserComponent)
            },
            {
                path: 'adduser',
                loadComponent: () => import('../../../users/components/add-edit-user/add-edit-user.component').then(m => m.AddEditUserComponent)
            }
        ], canActivate: [authGuard]
    },

    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    }
]