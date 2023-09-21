import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../IEmployee';
import { EmployeeService } from '../employee.service';
import { Router } from '@angular/router';
import { alertifyService } from 'services/alertify.service';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];
  search = '';
  searchContactPreference = '';
  sortByParam = '';

  constructor(private _employeeService: EmployeeService,
    private _router: Router,
    private _alertify: alertifyService) { }

  ngOnInit(): void {
    this._employeeService.getEmployees().subscribe(
      (employeesList) => this.employees = employeesList,
      (err) => console.log(err)
    )
  }

  sortContactPreferenceByAscending() {
    this.employees.sort((a, b) => (a.contactPreference < b.contactPreference ? -1 : 1));
  }

  sortContactPreferenceByDescanding() {
    this.employees.sort((a, b) => (a.contactPreference > b.contactPreference ? -1 : 1));
  }

  editButtonClick(employeeId: number) {
    this._router.navigate(['employees/edit', employeeId]);
  }

  deleteButtonClick(employeeId: number) {
    if (window.confirm('are you sure you want to delete this employee?')==true) {
      this._employeeService.deleteEmployee(employeeId).subscribe(
        () => this._router.navigate(['home']),
        (err: any) => console.log(err)
      );
      this._alertify.success("you are an employee successfully")
    }

    else
    {
      this._alertify.warning("employee not deleted");
    }
    this._router.onSameUrlNavigation = 'reload'
  }

  searchButtonClick() {
    this.searchContactPreference = this.search;
  }

  clearSearchButtonClick() {
    this.searchContactPreference = '';
    this.search = '';
  }
}
