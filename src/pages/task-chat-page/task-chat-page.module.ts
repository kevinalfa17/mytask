import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TaskChatPage } from './task-chat-page';

@NgModule({
  declarations: [
    TaskChatPage,
  ],
  imports: [
    //IonicModule.forChild(TaskChatPage),
  ],
  exports: [
    TaskChatPage
  ]
})
export class TaskChatPageModule {}
