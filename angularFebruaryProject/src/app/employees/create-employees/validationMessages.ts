/*class sonuna 'interface' eklenerek sorun çözüldü */
export class validationMessagesInterface {
    validationMessages: any =
        {
            'fullName':
            {
                'required': 'full name is required',
                'minlength': 'full name must be equal or greater than 2 characters',
                'maxlength': 'full name must be less than 30 characters'
            },
            'startingDate':
            {
                'required':'starting date is required'
            },
            'contactPreference':
            {
                'required': 'contact preference is required'
            },
            'email':
            {
                'required': 'email is required',
                'pattern' : 'invalid email',
                'emailDomain' : 'email domain should be one of them "outlook/gmail/hotmail/apple.com'
            },
            'confirmEmail':
            {
                'required': 'confirm email is required'
            },
            'emailGroup':
            {
                'emailsDontMatch' : 'email and confirm email must match'
            },
            'phone':
            {
                'required':'phone is required',
                'pattern':'invalid phone number',
                'maxlength':'phone numbers lenght must be 13',
                'minlength':'phone numbers lenght must be 13'
            },
            'salary':
            {
                'maxlength': 'salary must be less than 9999999'
            },
            'gender':
            {
                'required': 'gender is required'
            },
            /*
            'department':
            {
                'required': 'department is required'
            }
            'skills':
            {
                'required': 'skills are required',

            },
            'experience':
            {
                'required': 'experience is required'
            },
            'prificiency':
            {
                'required': 'proficiency is required'
            }
            */
        };

    formErrors: any =
        {
            'fullName': '',
            'startingDate':'',
            'contactPreference':'',
            'email': '',
            'confirmEmail':'',
            'emailGroup':'',
            'phone':'',
            'salary': '',
            'gender': '',
            'department': '',
            'skills': '',
            'experience': '',
            'proficiency': ''
        };
}
