import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { alertifyService } from 'services/alertify.service';
import { loginAuthService } from 'services/loginAuth.service';
import { userService } from '../user.service';
import { IUser } from '../IUser'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  user: IUser;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  constructor(private registerFormBuilder: FormBuilder,
    private authService: loginAuthService,
    private alertify: alertifyService,
    private router: Router,
    private _userService: userService,
    private httpClient: HttpClient) { }

  ngOnInit() {
    this.registerForm = this.registerFormBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern(this.emailRegex), Validators.minLength(12)]],
        password: ['', [Validators.required]]
      }
    )
  }

  onSubmit(register = this.registerForm) {

    const token = this.authService.loginAuthUser(register.value)
    if (token) {
      localStorage.setItem('token', token.email)
      this.alertify.success("register successfull");
      this.router.navigate(['/home']);
    }
    else {
      this.alertify.error("registiration error")
    }


    /*------*/
    // this.mapFormValuesToRegister();
    this.httpClient.get<any>("http://localhost:3000/users").subscribe(res => {
      const userLogin = res.find((a: any) => {
        return a.email === register.value.email && a.password === register.value.password
      })

      if (userLogin) {

        this.alertify.success('you are logged in');
        this.router.navigate(['home']);
      }
      else {
        this.alertify.error('logging error');
      }
    })

  }

  mapFormValuesToRegister() {
    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password
  }
}
