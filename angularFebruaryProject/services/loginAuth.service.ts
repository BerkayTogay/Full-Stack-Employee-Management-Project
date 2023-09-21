import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})

export class loginAuthService
{
    constructor() {}

    addUsers(user:any)
    {
      let users=[];
      if(localStorage.getItem('users'))
      {
        users=JSON.parse(localStorage.getItem('users'));
        users=[user, ...Object.values(users)];
      }
      else
      {
        users=[user]
      }
      localStorage.setItem('users', JSON.stringify(users))
    }

    loginAuthUser(user:any)
    {
      let users=[];
      if(localStorage.getItem('users'))
      {
        users=JSON.parse(localStorage.getItem('users'))
      }

      return users.find((x: { email: any; password: any; })=>x.email === user.email && x.password === user.password)
    }

}