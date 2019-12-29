import { CookieService } from 'ngx-cookie-service';
import { SocketService } from './../../../../../chat-app2/src/app/socket.service';
import { Router } from '@angular/router';

import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';


import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
export class ChatBoxComponent implements OnInit {

   @ViewChild('scrollMe', { static: false }) 
  
   public scrollMe: ElementRef;



  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any=[];
  public disconnectedSocket: boolean;
  public messageText: any; 
  public messageList: any = []; // stores the current message list display in chat box
  public pageValue: number = 0;
  public loadingPreviousChat: boolean = false;
  public scrollToChatTop:boolean= false;
  public previousChatList: any = [];

  constructor(public cookie: CookieService,public appService: AppService,public router: Router,private toastr: ToastrService,public socket:SocketService ) {
          console.log('constructr is called');
    
          // this.receiverId = this.cookie.get('receiverId');
          // console.log(this.receiverId);
          // this.receiverName=this.cookie.get('receiverName');
          // console.log(this.receiverName);
   }

  ngOnInit() {
    this.authToken = this.cookie.get('authtoken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
   
    this.receiverId = this.cookie.get('receiverId');
    console.log(this.receiverId);

    this.receiverName=this.cookie.get("receiverName");
    console.log(this.receiverName);
    
    // if(this.receiverId){
    //   this.userSelectedToChat(this.receiverId,this.receiverName);
    // }
    this.checkStatus();
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAUser();

    if(this.receiverId){
      this.userSelectedToChat(this.receiverId,this.receiverName);
    }
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
            //  this.getOnlineUserList();
           });

  }

  public getOnlineUserList:any =()=> {
    this.socket.onlineUserList().subscribe((userList)=>{
      this.userList = [];
      for(let x in userList){
        let temp = {'userId':x,'name':userList[x],'unread':0,'chatting':false};
        this.userList.push(temp);
      }
      console.log('refreshed user-list',this.userList);
    })

  }
  public userSelectedToChat(id,name):any{
    console.log('setting user as online');
    console.log('user-list',this.userList);
    this.userList.map((user)=>{
      // console.log('user',user);
      if(user.userId == id){
        user.chatting=true;
      }
      else{
        user.chatting=false;
      }
    })

    this.cookie.set('receiverId',id);
    this.cookie.set('receiverName',name);
    this.receiverId = id;
    this.receiverName= name;
    this.messageList = [];
    this.pageValue = 0;
    let chatDetails = {
      userId: this.userInfo.userId,
      senderId: id

    };

    this.socket.markChatAsSeen(chatDetails);
    this.getPreviousChatWithAUser();



  }

  public getPreviousChatWithAUser():any{
    let previousData = (this.messageList.length>0 ? this.messageList.slice():[]);
    this.socket.getChat(this.userInfo.userId, this.receiverId, this.pageValue*10).subscribe((apiResponse)=>{

      console.log(apiResponse);
      if(apiResponse.status == 200){
        this.messageList = apiResponse.data.concat(previousData);
      }
      else{
        this.messageList = previousData;
        this.toastr.warning('No messages available');
      }
      this.loadingPreviousChat = false;

    },(err)=>{
      this.toastr.error('some error occured');
    }
    )
  }

  public loadEarlierPageOfChat():any{
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithAUser();
  }

  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.sendMessage();

    }

  }

  public sendMessage: any = () => {

    if(this.messageText){

      let chatMsgObject = {
        senderName: this.userInfo.firstName + " " + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: this.cookie.get('receiverName'),
        receiverId: this.cookie.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      } // end chatMsgObject
      console.log(chatMsgObject);
      this.socket.SendChatMessage(chatMsgObject)
      this.pushToChatWindow(chatMsgObject)
      

    }
    else{
      this.toastr.warning('text message can not be empty')

    }

  }

  public pushToChatWindow(data): any{

    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop = false;
  
  
  }

  public getMessageFromAUser(): any {
    this.socket.chatByUserId(this.userInfo.userId).subscribe((data)=>{

      (this.receiverId==data.senderId)?this.messageList.push(data):'';
      this.toastr.success(`${data.senderName} says: ${data.message}`);
      this.scrollToChatTop=false;
    });//end subscribe
  }//end get message from a user

  public logout():any{
    this.appService.logout().subscribe((apiResponse)=>{
      
      if(apiResponse.status == 200){
        console.log('logout called');

        this.cookie.delete('authtoken');

        this.cookie.delete('receiverId');

        this.cookie.delete('receiverName');

        this.socket.exitSocket();

        this.router.navigate(['/']);
      } else {
        this.toastr.error(apiResponse.message);
      }

    }, (err)=>{
      this.toastr.error('some error occured');
    }
    );
  }//end of logout function
  


}

