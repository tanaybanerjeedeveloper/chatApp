import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import{ Observable} from 'rxjs';

// import { Cookie } from 'ng2-cookies/ng2-cookie

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'https://chatapi.edwisor.com';

  constructor(private http:HttpClient) { }//end of constructor

  public getUserInfoFromLocalStorage():any {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//get method to get the userdetails whenever required

  public setUserInfoInLocalStorage(data): any {
    localStorage.setItem('userInfo',JSON.stringify(data));
  }// set method to update or store the userdetails in local-storage

  public signupFunction(data):Observable<any> {
    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobile', data.mobile)
    .set('email', data.email)
    .set('password', data.password)
    .set('apiKey', data.apiKey);

    return this.http.post(`${this.url}/api/v1/users/signup`,params);
  }// end of signup function

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
    
    return this.http.post(`${this.url}/api/v1/users/login`,params);

  }//end of signin function
}