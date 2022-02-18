import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthService } from '../Shared/Services/auth.service';
import { UserService } from '../Shared/Services/UserService/user.service';
import { GlobalConstants } from '../Shared/user-type';

export class PhoneNumberValidatorDirective implements Validator {
  validate(control: AbstractControl) : {[key: string]: any} | null {
    if (control.value && control.value.length != 10) {
      return { 'phoneNumberInvalid': true };
    }
    return null;
  }
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  myForm!: FormGroup;
  x!:FormGroup;
  type:string="";
  emailExists=false;
  constructor(private fb: FormBuilder,private _auth :AuthService,private _user:UserService) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,this.ValidatePassword ]],
      passwordc: ['',[Validators.required,this.ValidatePasswordConfirm]],
      type: ['', [Validators.required ]],
     
      
  
    } );
  }
  ValidatePasswordConfirm(control: AbstractControl): {[key: string]: any} | null  {

  if (control.value && control.parent?.get("password")?.value !=control.value ) {
    return { 'ValidatePassword': true };
  }
  return null;
}
ValidatePassword(control: AbstractControl): {[key: string]: any} | null  {

  if (control.value && control.value.length<8 ) {
    return { 'ValidatePassword': true };
  }
  return null;
}


get errorMessage(): string {
  const form: FormControl = (this.myForm.get('password') as FormControl);
  return form.hasError('required') ?
    'Password is required' :
    form.hasError('ValidatePassword') ?
    'Password length should be more than 8 caracters' : 
    form.hasError('ValidatePassword') ?
    'Passowrdr' : '';
}
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('password', form.value.password);
    console.log('Email', form.value.email);
    console.log('Email', form.value.type);

   //verify email exists or not 

    this._user.getUserBy(form.value.email).subscribe({
      next:(res)=>{
      console.log(res)
      //@ts-ignore
      if(res.value.length==0){
        this.emailExists=false;

        this.type=form.value.type;
        this.x=form;
      }else{
        this.emailExists=true;
        console.log("email exists please login");
      }

    },
    error:(er)=>{},
    complete:()=>{}});

    
   
  }
}