import { Routes } from "@angular/router";
import { authGuard } from "../../../../core/auth/auth.guard";
import { roleGuard } from "../../../../core/auth/role.guard";

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
        path: 'Ums',
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('../../../../features/layout/secure-layout/component/main-page/main-page.component').then(m => m.MainPageComponent)
            },
            {
                path: 'user',
                loadComponent: () => import('../../../users/components/user/user.component').then(m => m.UserComponent)
            },
            {
                path: 'adduser',
                canActivate: [roleGuard],
                loadComponent: () => import('../../../users/components/add-edit-user/add-edit-user.component').then(m => m.AddEditUserComponent)
            }
        ]
    },

    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    }
]