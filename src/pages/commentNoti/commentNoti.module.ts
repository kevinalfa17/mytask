import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommentNoti} from './commentNoti';

@NgModule({
  declarations: [
    CommentNoti,
  ],
  imports: [
    //IonicModule.forChild(ChatViewPage),
  ],
  exports: [
    CommentNoti
  ]
})
export class ChatViewModule {}
