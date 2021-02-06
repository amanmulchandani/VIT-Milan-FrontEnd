import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;
  signupForm : FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { 
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''
    };
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  signup() {
    this.signupForm.get('username').setValue(this.signupForm.get('username').value.toString().trim());
    this.signupForm.get('email').setValue(this.signupForm.get('email').value.toString().trim());

    if(this.signupForm.valid){
      this.signupRequestPayload.username = this.signupForm.get('username').value;
      this.signupRequestPayload.email = this.signupForm.get('email').value;
      this.signupRequestPayload.password = this.signupForm.get('password').value;

      this.authService.signup(this.signupRequestPayload)
        .subscribe(() => {
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        }, () => {
          this.toastr.error('Username/Email already in use');
        });
    }
  }

}
