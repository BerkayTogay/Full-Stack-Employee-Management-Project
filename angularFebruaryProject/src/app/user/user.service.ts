import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { IUser } from "./IUser";

@Injectable()
export class userService
{
    baseUrl='http://localhost:3000/users';
    constructor(private httpClient:HttpClient){}

    private handleError(errorResponse:HttpErrorResponse)
    {
        if(errorResponse.error instanceof ErrorEvent)
        {
            console.log('client side error', errorResponse.error.message)
        }
        else
        {
            console.log('server side error', errorResponse)
        }

        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }

    addUsers(user:IUser):Observable<IUser>
    {
        return this.httpClient.post<IUser>(this.baseUrl, user,
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    getUsers():Observable<IUser[]>
    {
        return this.httpClient.get<IUser[]>(this.baseUrl)
        .pipe(catchError(this.handleError))
    }

    getUser(id:number):Observable<IUser>
    {
        return this.httpClient.get<IUser>(`${this.baseUrl}/${id}`)
        .pipe(catchError(this.handleError))
    }

    getUserByEmail(email:string):Observable<string>
    {
        return this.httpClient.get<string>(`${this.baseUrl}/${email}`);
    }
    
    updateUsers(user:IUser):Observable<void>
    {
        return this.httpClient.put<void>(`${this.baseUrl}/${user.id}`, user,
        {
            headers:new HttpHeaders({
                'Content-Type':'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

}