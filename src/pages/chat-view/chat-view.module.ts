import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ChatViewPage } from './chat-view';

@NgModule({
  declarations: [
    ChatViewPage,
  ],
  imports: [
    //IonicModule.forChild(ChatViewPage),
  ],
  exports: [
    ChatViewPage
  ]
})
export class ChatViewModule {}
