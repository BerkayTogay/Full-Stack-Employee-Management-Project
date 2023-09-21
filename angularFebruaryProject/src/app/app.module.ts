import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { userModule } from './user/modules/user.module';
/* for lazy loading, we r removing this referance
import { EmployeeModule } from './modules/employee.module';
*/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker'


import { EmployeeService } from './employees/employee.service';
import { userService } from './user/user.service';
import { loginAuthService } from '../../services/loginAuth.service';
import { alertifyService } from 'services/alertify.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pageNotFound/page-not-found.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { authGuard } from 'services/authGuard.service';





/* we don't need to import reactiveFormsModule here, because non of theese modules are using formsModule */

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    /*
    RegisterComponent,
    LoginComponent
    */
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    /*EmployeeModule, we removed this because of lazy loading. For lazy loading, we can only referance from 1 module */
    AppRoutingModule,
    userModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [EmployeeService,
              userService,
              loginAuthService,
              alertifyService,
              authGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }



