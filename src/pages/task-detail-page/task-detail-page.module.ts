import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TaskDetailPage } from './task-detail-page';

@NgModule({
  declarations: [
    TaskDetailPage,
  ],
  imports: [
    //IonicModule.forChild(TaskDetailPage),
  ],
  exports: [
    TaskDetailPage
  ]
})
export class TaskDetailPageModule {}
