// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //instance vars or properties
  public email: any;
  public password: any;

  constructor(public appService: AppService,public router: Router,private toastr: ToastrService,public cookie: CookieService) { }

  ngOnInit() {
  }

  public goToSignUp():any{
    this.router.navigate(['/sign-up']);
  }// end of gotosignup

  public signinFunction():any {
    if(!this.email) {
      this.toastr.warning('enter email');
    }
    else if(!this.password) {
      this.toastr.warning('enter password');
    }
    else {
      let data = {
        email:this.email,
        password: this.password
      }

      this.appService.signinFunction(data).subscribe((apiResponse) => {

        if(apiResponse.status === 200) {
          console.log(apiResponse);
          this.cookie.set('authtoken', apiResponse.data.authToken);
          this.cookie.set('receiverId', apiResponse.data.userDetails.userId);
          this.cookie.set('receiverName', apiResponse.data.userDetails.firstName);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.router.navigate(['/chat']);


        } else {
          this.toastr.error(apiResponse.meassage);
        }
        (err) => {
          this.toastr.error('some error occured');
        }
      });
    }// else ends
  }// sign-in-function ends


}// component ends
