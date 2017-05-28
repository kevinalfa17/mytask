import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CreateTaskPage } from './create-task';

@NgModule({
  declarations: [
    CreateTaskPage,
  ],
  imports: [
    //IonicModule.forChild(CreateTaskPage),
  ],
  exports: [
    CreateTaskPage
  ]
})
export class CreateTaskModule {}
