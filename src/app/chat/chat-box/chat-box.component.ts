import { CookieService } from 'ngx-cookie-service';
import { SocketService } from './../../../../../chat-app2/src/app/socket.service';
import { Router } from '@angular/router';

import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {
  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any=[];
  public disconnectedSocket: boolean;

  constructor(public cookie: CookieService,public appService: AppService,public router: Router,private toastr: ToastrService,public socket:SocketService ) {
          this.receiverId = this.cookie.get('receiverId');
          this.receiverName=this.cookie.get('receiverName');
   }

  ngOnInit() {
    this.authToken = this.cookie.get('authtoken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
  }

  public checkStatus: any = ()=>{
    if(this.cookie.get('authtoken')===undefined || this.cookie.get('authtoken')==="" || this.cookie.get('authtoken')===null){
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

  public verifyUserConfirmation: any=()=>{
    this.socket.verifyUser()
           .subscribe((data)=>{
             this.disconnectedSocket=false;
             this.socket.setUser(this.authToken);
             this.getOnlineUserList();
           });

  }

  public getOnlineUserList:any =()=> {
    this.socket.onlineUserList().subscribe((userList)=>{
      this.userList = [];
      for(let x in userList){
        let temp = {'userId':x,'name':userList[x],'unread':0,'chatting':false};
        this.userList.push(temp);
      }
      console.log(this.userList);
    })

  }

}

