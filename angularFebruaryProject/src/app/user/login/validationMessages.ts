export class loginValidationClassInterface
{
    validationMessage:any =
    {
        'email':
        {
            'required':'email is required',
            'minlength':'email must be equal or greater than 12 characters',
            'pattern':'invalid email'
        },
        'password':
        {
            'required':'password is required'
        }
    }

    validationFormErrors:any=
    {
        'email':'',
        'password':''
    }
}