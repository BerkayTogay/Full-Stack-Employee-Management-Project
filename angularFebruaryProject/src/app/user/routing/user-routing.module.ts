import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "src/app/user/login/login.component";
import { RegisterComponent } from "src/app/user/register/register.component";

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation:'reload'})],
    exports: [RouterModule]
})

export class UserRoutingModule { }
