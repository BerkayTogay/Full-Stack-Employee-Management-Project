import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pageNotFound/page-not-found.component';



const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'employees',
    loadChildren: () => import('./modules/employee.module').then(x => x.EmployeeModule)
  },
  {
    path: 'user', loadChildren: () => import('./user/modules/user.module').then(x => x.userModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
