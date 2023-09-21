import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ISkill } from './ISkill';

@Injectable()
export class EmployeeService {
    baseUrl = 'http://localhost:3000/employees';
    constructor(private httpClient: HttpClient) {
    }

    getEmployees(): Observable<IEmployee[]> {
        return this.httpClient.get<IEmployee[]>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getGenders():Observable<string[]>
    {
      return this.httpClient.get<string[]>('http://localhost:5247/api/gender');
    }

    getCities():Observable<string[]>
    {
      return this.httpClient.get<string[]>('http://localhost:5247/api/city/cities');
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }

    getEmployee(id: number): Observable<IEmployee> {
        return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.httpClient.post<IEmployee>(this.baseUrl, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    updateEmployee(employee: IEmployee): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deleteEmployee(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
}

/*
import { Injectable} from '@angular/core';

@Injectable()

export class employeeService
{
    baseUrl='http://localhost/3000/employees';
    constructor(private httpClient:HttpClient){}
    private listEmployees = IEmployee[]

    getEmployees():Observable<IEmployee[]>
    {
        return this.httpClient.get<IEmployee[]>(this.baseUrl);
    }

    getEmployee(id:number):Observable<IEmployee[]>
    {
        return this.httpClient.get<IEmployee[]>('${this.baseUrl}/${id}');
    }

    addEmployee(employee:IEmployee):Observable<IEmployee[]>
    {
        return this.httpClient.post<IEmployee[]>(this.baseUrl, employee ,
            {
                headers : new HttpHeaders({
                    'content-type':'application/json'
                })
            })
        .pipe(catchError(this.handleError));
    }

    deleteEmployee(employee:IEmployee):Observable<IEmployee[]>
    {
        return this.httpClient.delete<void>('${this.baseUrl}/${id}')
    }

    updateEmployee(employee:IEmployee):Observable<IEmployee[]>
    {
        return this.httpClient.put<void>('${this.baseUrl}/${employee.id}/', employee
        {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
}

*/
