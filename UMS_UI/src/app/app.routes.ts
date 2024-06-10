import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/layout/secure-layout/routes/secure-layout.routes').then(m => m.SecureRoutes)
    }
    // {
    //     path: '',
    //     loadComponent: () => import('./features/component/testing/testing.component').then(m => m.TestingComponent)
    // }
];
