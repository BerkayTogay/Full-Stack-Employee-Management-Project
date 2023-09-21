import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { UserRoutingModule } from "../routing/user-routing.module";

import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";


@NgModule({
    declarations:[
        LoginComponent,
        RegisterComponent
    ],
    imports:[
        UserRoutingModule,
        CommonModule,
        ReactiveFormsModule
    ]
})

export class userModule{}