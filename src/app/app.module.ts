import { SocketService } from './../../../chat-app2/src/app/socket.service';
import { LoginComponent } from './user/login/login.component';
import { RouterModule } from '@angular/router';
import { UserModule } from './user/user.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from './../../../chat-app2/src/app/app.service';


// import { CookieModule } from 'ngx-cookie';

const config: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule  ,
    AppRoutingModule,
    ChatModule,
    UserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot() ,
    RouterModule.forRoot([
      { path:'login',component:LoginComponent, pathMatch:'full'},
      { path: '',redirectTo:'login',pathMatch:'full'},
      { path: '*', component:LoginComponent},
      { path: '**', component:LoginComponent}
    ])
    
  ],
  providers: [CookieService,AppService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
