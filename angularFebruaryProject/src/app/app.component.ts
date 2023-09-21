import { Component, Injectable } from '@angular/core';
import { alertifyService } from 'services/alertify.service';
import { IUser } from './user/IUser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angularFebruaryProject';
  //loggedInUserName:string
  loggedInUserName:string;
  user:IUser;
  Today=new Date();

  constructor(private alertify:alertifyService, private router:Router){}

  ngOnInit()
  {

  }

  loggedIn()
  {
    this.loggedInUserName=localStorage.getItem('token');
    return this.loggedInUserName;
    const{ redirect }=window.history.state;
    this.router.navigateByUrl(redirect);
  }

  logout()
  {
     localStorage.removeItem('token');
     this.alertify.error("you are logged out");
     this.router.navigate((['']));

  }
}
