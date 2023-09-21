import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from '../employees/routing/employee-routing.module';
import { FormsModule } from '@angular/forms';

import { CreateEmployeesComponent } from '../employees/create-employees/create-employees.component';
import { ListEmployeesComponent } from '../employees/list-employees/list-employees.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FilteringPipe } from 'pipes/filter.pipe';
import { SortPipe } from 'pipes/sort.pipe';



/* our page uses reactiveFormsModule ([formGroup].. etc), we need to import our formsModule in this file too */
/* our page uses commonModule beacuse page uses ngFor, ngIf etc what angular needs to use. When we create module, it is
    importing defaultly */
@NgModule({
  declarations: [
    CreateEmployeesComponent,
    ListEmployeesComponent,
    FilteringPipe,
    SortPipe

  ],
  imports: [
    EmployeeRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    BsDatepickerModule,
    FormsModule
  ]
})
export class EmployeeModule { }
