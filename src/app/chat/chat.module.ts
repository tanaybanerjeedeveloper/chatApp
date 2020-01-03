import { ChatRouteGuardService } from './chat-route-guard.service';
import { SharedModule } from './../shared/shared.module';
import { RemoveSpecialCharPipe } from './../shared/pipe/remove-special-char.pipe';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [ChatBoxComponent, RemoveSpecialCharPipe],
  providers:[ChatRouteGuardService],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot() ,
    SharedModule,
    RouterModule.forChild([
      {path:'chat', component: ChatBoxComponent, canActivate:[ChatRouteGuardService]}
    ])
  ]
})
export class ChatModule { }
