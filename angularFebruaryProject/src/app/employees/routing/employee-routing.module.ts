import { NgModule } from '@angular/core';
// Import RouterModule & Routes type
import { RouterModule, Routes } from '@angular/router';

// Import all the components that we will be referencing in the route definitions
import { CreateEmployeesComponent } from '../create-employees/create-employees.component';
import { ListEmployeesComponent } from '../list-employees/list-employees.component';
import { authGuard } from 'services/authGuard.service';

// Define the routes
const appRoutes: Routes = [
      { path: 'list', component: ListEmployeesComponent , canActivate:[authGuard]},
      { path: 'create', component: CreateEmployeesComponent, canActivate:[authGuard]},
      { path: 'edit/:id', component: CreateEmployeesComponent, canActivate:[authGuard] }
];

// In a feature module forChild() method must be used to register routes
// Export RouterModule, so the it's directives like RouterLink, RouterOutlet
// are available to the EmployeeModule that imports this module
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
