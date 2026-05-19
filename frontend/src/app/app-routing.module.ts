import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProduitsComponent } from './produits/produits.component';
import { StocksComponent } from './stocks/stocks.component';

import { LoginComponent } from './login/login.component';

const routes: Routes = [

  // Login
  {
    path: 'login',
    component: LoginComponent
  },

  // Layout principal
  {
    path: '',
    component: LayoutComponent,

    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'produits',
        component: ProduitsComponent
      },

      {
        path: 'stocks',
        component: StocksComponent
      },

      // Redirection par défaut
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}