import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable} from 'rxjs';
import 'rxjs/add/operator/catch';
import { tap,catchError } from "rxjs/operators";
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie-service';
// import { Socket } from 'ngx-socket-io';
// import * as io from 'ngx-socket-io';
// import { map } from 'rxjs/operators';
//  map((response:any):any=>{
//    return Response;
//  })

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private socket;
  private url = 'https://chatapi.edwisor.com'; 

  constructor(public http: HttpClient,public cookie: CookieService) {
    this.socket = io(this.url);// handshake b/w the server and the client is done here
   }

  //  sendMessage(msg:string){
  //    this.socket.emit("message",msg);
  //  }
  //  getMessage(){
  //    return this.socket
  //       .fromEvent("message")
  //       .map(data=> data.msg);
  //  

   public verifyUser = () => {//method where verify-user event is listened
      
    return Observable.create((observer) => {
      this.socket.on('verifyUser',(data) => {
        observer.next(data);
      }); //end of Socket
    });// end of Observable
   }

   public onlineUserList = () => {
     return Observable.create((observer) => {
       this.socket.on('online-user-list',(userList) => {
         observer.next(userList);
       });// end of socket or end of the communication channel
     })// end of Observable
   }

   public disconnectedSocket = () => {
     return Observable.create((observer)=> {
       this.socket.on('disconnect',() => {
         observer.next();
       })// end of channel
     })//end of Observable
   }

   public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  }

   //Events to be emitted

   public setUser = (authToken) => {
     this.socket.emit('set-user',authToken);
   }

   public markChatAsSeen = (userDetails) => {//event to be emitted when user starts chat with other user
     this.socket.emit('mark-chat-as-seen',userDetails);
   }

   public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  }
   

   public getChat(senderId, receiverId, skip): Observable<any> {

    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${this.cookie.get('authtoken')}`).pipe(
      
        tap(data => console.log('Data Received')),
        catchError((this.handleError))
      )

  }

  public exitSocket = () =>{


    this.socket.disconnect();


  }
  //exit socket
 
      private handleError(err:HttpErrorResponse) {
      let errorMessage = '';
      if(err.error instanceof Error) {
        errorMessage = `An error has occurred: ${err.error.message}`;
      } else {
        errorMessage = `Server returned code: ${err.status},error message is: ${err.error.message}`;
      }
      console.error(errorMessage);
      return Observable.throw(errorMessage);
   }// end of handling error function


}

