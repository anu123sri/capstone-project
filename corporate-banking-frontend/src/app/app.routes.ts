import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { AppLayoutComponent } from './layout/app-layout/app-layout';

import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { UserManagementComponent } from './admin/user-management/user-management';
import { RmDashboard } from './rm/rm-dashboard/rm-dashboard';
import { AnalystDashboard } from './analyst/analyst-dashboard/analyst-dashboard';

export const routes: Routes = [

  /* 🔹 DEFAULT → LOGIN */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* 🔹 LOGIN */
  { path: 'login', component: LoginComponent },

  /* 🔹 PROTECTED AREA */
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      /* ================= ADMIN ================= */
      {
  path: 'admin',
  canActivateChild: [RoleGuard],
  data: { roles: ['ADMIN'] },
  children: [
    { path: '', component: AdminDashboard },
    { path: 'users', component: UserManagementComponent }
  ]
},


      /* ================= RM ================= */
{
  path: 'rm',
  canActivate: [AuthGuard],
  canActivateChild: [RoleGuard],
  data: { roles: ['RELATIONSHIP_MANAGER'] },
  children: [

    { path: '', component: RmDashboard },

    {
      path: 'clients/create',
      loadComponent: () =>
        import('./rm/clients/create-client/create-client')
          .then(m => m.CreateClientComponent)
    },

    {
      path: 'clients',
      loadComponent: () =>
        import('./rm/clients/view-clients/view-clients')
          .then(m => m.ViewClientsComponent)
    },

    {
      path: 'credit-request',
      loadComponent: () =>
        import('./rm/credit/create-credit/create-credit')
          .then(m => m.CreateCreditComponent)
    },

    {
      path: 'credits',
      loadComponent: () =>
        import('./rm/credit/view-credits/view-credits')
          .then(m => m.ViewCreditsComponent)
    },
    {
  path: 'clients/:id/edit',
  loadComponent: () =>
    import('./rm/edit-client/edit-client')
      .then(m => m.EditClientComponent)
}


  ]
},


      /* ================= ANALYST ================= */
     {
  path: 'analyst',
  canActivateChild: [RoleGuard],
  data: { roles: ['ANALYST'] },
  children: [
    { path: '', redirectTo: 'credits', pathMatch: 'full' },
    {
      path: 'credits',
      loadComponent: () =>
        import('./analyst/credit-requests/credit-requests')
          .then(m => m.CreditRequestsComponent)
    }
  ]
}

    ]
  },

  /* 🔹 FALLBACK */
  { path: '**', redirectTo: 'login' }
];
