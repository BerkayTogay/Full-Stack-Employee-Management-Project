import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validationMessagesInterface } from 'src/app/employees/create-employees/validationMessages';
import { loginAuthService } from '../../../../services/loginAuth.service';
import { alertifyService } from 'services/alertify.service';
import { userService } from '../user.service';
import { Router } from '@angular/router';
import { IUser } from '../IUser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  userLoggedIn:boolean;
  user:IUser;


  

  constructor(private loginPageFormBuilder: FormBuilder,
    private loginAuthService: loginAuthService,
    private alertify:alertifyService,
    private userService:userService,
    private router:Router) { }

  loginValidationHolder = new validationMessagesInterface();

  ngOnInit() {
    this.loginForm = this.loginPageFormBuilder.group
      (
        {
          email: ['', [Validators.required, Validators.minLength(12), Validators.pattern(this.emailRegex)]],
          password: ['', [Validators.required]]
        }
      )

    this.loginForm.valueChanges.subscribe((data) => {
      this.loginValidationMethod(this.loginForm)
    }
    )
  }

  onLogin(login=this.loginForm) {
    console.log(login.value);
    /*if(this.user.id)
    {
      this.userService.updateUsers(this.user).subscribe
      (
        ()=>this.router.navigate(['']),
        (err:any)=>console.log(err),
      )
      this.alertify.success('welcome'+this.user.email);
    }
    */
      this.mapFormValuesToUser();
      this.userService.addUsers(this.user).subscribe
      (
        ()=>this.router.navigate(['']),
        (err:any)=>console.log(err), 
      )
      this.alertify.success('new user registration is successfull')
    
      
    
    this.user = Object.assign(this.user, this.loginForm.value);
    this.loginAuthService.addUsers(this.user);
    this.loginForm.reset();
    
  }

  mapFormValuesToUser()
  {
    this.user=<IUser>this.loginForm.value
  }

  loginValidationMethod(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const errorControl = group.get(key);
      this.loginValidationHolder.formErrors[key] = '';
      if (errorControl && !errorControl.valid && (errorControl.touched ||
        errorControl.dirty || errorControl.value !== '')) {
        const errorMessages = this.loginValidationHolder.validationMessages[key];

        for (const loginErrorKey in errorControl.errors) {
          this.loginValidationHolder.formErrors[key] += errorMessages[loginErrorKey] + ' ';
        }
      }
    })
  }
}
