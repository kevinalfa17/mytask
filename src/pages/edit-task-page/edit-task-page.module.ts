import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EditTaskPage } from './edit-task-page';

@NgModule({
  declarations: [
    EditTaskPage,
  ],
  imports: [
    //IonicModule.forChild(EditTaskPage),
  ],
  exports: [
    EditTaskPage
  ]
})
export class EditTaskPageModule {}
