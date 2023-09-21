import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { validationMessagesInterface } from './validationMessages';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { IEmployee } from '../IEmployee';
import { ISkill } from '../ISkill';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { alertifyService } from 'services/alertify.service';


@Component({
  selector: 'app-create-employees',
  templateUrl: './create-employees.component.html',
  styleUrls: ['./create-employees.component.css']
})



export class CreateEmployeesComponent {
  employeeForm!: FormGroup;
  employee: IEmployee; // this employee is, when we want to update our database with using 'save' button, we can use
  // this employee for updating our values
  pageTitle: string;
  cityList:any[];

  employeeView: IEmployee={
    id:null,
    fullName:null,
    startingDate:null,
    contactPreference:null,
    email:null,
    confirmEmail:null,
    phone:null,
    city:null,
    salary:null,
    gender:null,
    departmentAndSkills:null,
  };

  @ViewChild('employeeTabs') employeeTabs: TabsetComponent;

  constructor(private createPageFormBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService,
    private _router: Router,
    private alertify: alertifyService) { };

  validationHolder = new validationMessagesInterface();

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
  phonePattern = '[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}'

  ngOnInit() {
    this.employeeForm = this.createPageFormBuilder.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
        startingDate:['DD-MM-YYYY',[Validators.required]],
        contactPreference: ['email',[Validators.required]],
        emailGroup: this.createPageFormBuilder.group(
          {
            email: ['', [Validators.required, Validators.pattern(this.emailRegex), emailDomain]],
            confirmEmail: ['', Validators.required],
          }, { validator: matchEmail }
        ),
        phone: ['', Validators.pattern(this.phonePattern)],
        city:[''],
        salary: [''],
        gender: ['', Validators.required],
        departmentAndSkills: this.createPageFormBuilder.array(
          [
            this.addSkillsFormGroup()
          ])
      }
    )

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    /* subsbcribe -> observable (isteğin) sonlandığını belirtiyor.
       observable -> istek durumunda olan yapıdır. Subjectten bir ya da birden fazla observable istekte bulunabilir.
                    (subject) -> erişilmek istenen data
    */

    /* subscribe for 'email' or 'phone' selected - (click) method not prefered. Subscribing is better solution */

    this.employeeForm.get('contactPreference')?.valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    /* getting gender from genders controller web api

    this._employeeService.getGenders().subscribe(data=>{
      this.employeeView.gender=data as unknown as string;
      console.log(data);
    })

    */;

    /* getting cities from cities controller web api */
    this._employeeService.getCities().subscribe(data=>{
      this.employeeView.city=data as unknown as string;
      this.cityList=data as unknown as any;
      console.log(data);
    })
    /* ----------------- ** ------------------------ */

    /*  *********************** editing ******************* */
    /*subscribing for mapping activated route, it comes from edit/:id route */
    this._activatedRoute.paramMap.subscribe(params => {
      const employeeId = +params.get('id')/*get içerisindeki id değeri, linkten geliyor */
      if (employeeId) {
        this.getEmployee(employeeId);
        this.pageTitle = 'Edit Employee';
      }
      else /* if id do not match with the where the inside of the link, we are creating a new employee */ {
        this.pageTitle = 'Create Employee';
        this.employee =
        {
          id: null,
          fullName: '',
          startingDate:'',
          contactPreference: '',
          email: '',
          city:'',
          confirmEmail: '',
          phone: null,
          gender: '',
          salary: null,
          departmentAndSkills: []
        };
      }
    })
  }

  selectTab(tabId:number)
  {
    this.employeeTabs.tabs[tabId].active=true;
  }

  /* edit page, getting selected employee whose id's matches with it*/
  getEmployee(id: number) {
    this._employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        this.employee = employee; // this employee for updating database with new employee values //
        this.editEmployee(employee);
      },
      (err: any) => console.log(err)
    );
  }
  /* when we editing formGroup and formControl, we are doing it with 'patchValue'
     when we editing formArray, we are doing it with 'setControl'
     this method is editing formGroups and formArrays continue*/
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue(
      {
        fullName: employee.fullName,
        startingDate: employee.startingDate,
        contactPreference: employee.contactPreference,
        emailGroup:
        {
          email: employee.email,
          confirmEmail: employee.confirmEmail
        },
        phone: employee.phone,
        city:employee.city,
        salary: employee.salary,
        gender: employee.gender
      }
    );

    /* with this line, we started to edit for formArray */
    this.employeeForm.setControl('departmentAndSkills', this.setExistingDepartmentAndSkills(employee.departmentAndSkills));
  }

  /* when we editing a form array, we must use 'setControl'
      editing a formArray is completely different from formGroup and formControls
      we are still editing formArray with this method */
  setExistingDepartmentAndSkills(skills: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skills.forEach(x => {
      formArray.push(this.createPageFormBuilder.group({
        department: x.department,
        skills: x.skills,
        experience: x.experience,
        proficiency: x.proficiency
      }));
    });

    return formArray;
  }

  setEmailAndConfirmEmail(emailGroup:any):FormGroup{
    emailGroup
    return emailGroup
  }


  /*  ************* editing line finished ****************** */

  /* create button clicked */
  /* *************** updating databse lines starts **************/
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) /* if id is true, we are updating an employee from database */ {
      this._employeeService.updateEmployee(this.employee).subscribe
        (
          () => this._router.navigate(['employees/list']),
          (err: any) => this.alertify.error(err),
        );
        this.alertify.success('employee successfully updated');
    }
    else /* we are creating a new employee */ {
      this._employeeService.addEmployee(this.employee).subscribe
        (
          () => this._router.navigate(['employees/list']),
          (err: any) => console.log(err)
        );
        this.alertify.success('employee successfully created');
    }
  }

  mapFormValuesToEmployeeModel() //this is where we holding and updating our data with database
  {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.startingDate=this.employeeForm.value.startingDate;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.confirmEmail = this.employeeForm.value.emailGroup.confirmEmail;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.city=this.employeeForm.value.city;
    this.employee.gender = this.employeeForm.value.gender;
    this.employee.salary = this.employeeForm.value.salary;
    this.employee.departmentAndSkills = this.employeeForm.value.departmentAndSkills;
  }
  /* *************** updating databse lines ends  **************/

  /* email or phone radio selected */
  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('emailGroup')?.get('email');
    const confirmEmailControl = this.employeeForm.get('emailGroup')?.get('confirmEmail');
    if (selectedValue === 'phone') {
      phoneControl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)]);
      emailControl?.clearValidators();
      confirmEmailControl?.clearValidators();
    }
    if (selectedValue === 'email') {
      emailControl?.setValidators([Validators.required, emailDomain, Validators.pattern(this.emailRegex)]);
      confirmEmailControl?.setValidators(Validators.required);
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
    confirmEmailControl?.updateValueAndValidity();
  }


  /* load data button clicked */
  onLoadDefaultDataClick(): void {
    this.employeeForm.setValue({
      fullName: 'berkay togay',
      contactPreference: 'email',
      emailGroup:
      {
        email: 'berkaytogay@hotmail.com',
        confirmEmail: 'berkaytogay@hotmail.com'
      },
      phone: '',
      salary: 10000,
      gender: 'male',
      departmentAndSkills: {
        department: 'IT',
        skills: 'C#',
        experience: 5,
        proficiency: 'intermediate'
      },
    });
  }

  /* clear button clicked */
  clearAllData(): void {

    this.employeeForm.reset(
      {
        'fullName':'',
        'startingDate':'',
        'email':'',
        'contactPreference':'',
        'emailGroup':
        {
          'email':'',
          'confirmEmail':''
        },
        'phone':'',
        'salary':'',
        'gender':'',
        'departmentAndSkills':
        {
          'department':'',
          'skills':'',
          'experience':'',
          'proficiency':''
        }
      }
    );
    /*
    this.employeeForm.get('emailGroup')?.reset();
    this.employeeForm.reset();
    */
  }


  // ****************** dynamicly adding skills formgroup as a form array ****************** //
  /* dynamicly adding 'skills' as a formArray of fromGroup */
  addSkillsFormGroup(): FormGroup {
    return this.createPageFormBuilder.group(
      {
        department: ['', Validators.required],
        skills: ['', [Validators.required]],
        experience: ['', Validators.required],
        proficiency: ['', Validators.required]
      }
    )
  }

  /* for dynamicliy adding 'skills', this method triggered when 'add' button clicked */

  addSkillButtonClick(): void {
    /* with normally using get method returns abstractControl, the parent class of formgroup-formcontrol and formarray..
        but we need 'push' method for adding skill groups dynamicly. For that reason, we need a typeCast operator
        as a 'formArray' because of push method
    */
    (<FormArray>this.employeeForm.get('departmentAndSkills')).push(this.addSkillsFormGroup());
  }

  /* remove skill button clicking */
  removeSkillButtonClick(departmentAndSkillsGroupIndex: number): void {
    /* touched and dirty gibi propertylerde değişiklik yapmak istediğimiz için, döndürülecek formArray değerini const
    olarak tanımlayıp, istediğimiz gibi değiştirebiliyoruz */
    const departmentAndSkillsFormArray = <FormArray>this.employeeForm.get('departmentAndSkills');
    departmentAndSkillsFormArray.removeAt(departmentAndSkillsGroupIndex);
    departmentAndSkillsFormArray.markAsDirty();
    departmentAndSkillsFormArray.markAsTouched();
  }

  getControlForSkills() {
    return (this.employeeForm.get('departmentAndSkills') as FormArray).controls;
  }

  // ****************** dynamicly adding skills formgroup as a form array finished ****************** //

  /* log validation errors with same way to looping button clicked method */
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.validationHolder.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched ||
        abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationHolder.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.validationHolder.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl)
      }

      /* we were first write this form array error validation because, we weren't used this dynamicly and hardcoded
      this formArray errors. But after that, we made a dynamic for loop for adding skills button and for each input elements,
      we writed this error code in html page (we used 'skill' in html, because of our for loops index name)
      *******
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control)
          }
        }
      }
      ******
      */
    })
  }
}

/*custom email domain için 3 adımdan ilki, (adim 1 -> fonksiyonu yaz),
                      (adım 2 -> ilgili kısmın validatoru içerisinde fonksiyonu tanımla)
                      (adım 3 -> hata mesajını ilgili noktada tanımla)
*/
/* key value pair mantığı hakim */
function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email?.substring(email.lastIndexOf('@') + 1);
  if ((domain?.toLowerCase() === 'outlook.com') || (domain?.toLowerCase() === 'gmail.com') ||
    (domain?.toLowerCase() === 'hotmail.com') || (email === '')) {
    return null;
  }
  else {
    /* fonksionun tanımında belirtilen keyValuePair yapısına uygun,
    any değer döndüren, herhangi bir isimde çağrılacak (burada fonksiyon adıyla aynı) değişkenle tanımlı */
    return { 'emailDomain': true };
  }
}

/* -------------- */
/* function for e-mail addresses match */
function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const email = group.get('email');
  const confirmEmail = group.get('confirmEmail');

  if (email!.value === confirmEmail!.value || confirmEmail!.pristine &&
    confirmEmail.value === '') {
    return null;
  }
  else {
    return { 'emailsDontMatch': true }
  }
}
