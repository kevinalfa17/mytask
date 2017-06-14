import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CreateOwnTaskPage } from './create-own-task-page';

@NgModule({
  declarations: [
    CreateOwnTaskPage,
  ],
  imports: [
    //IonicModule.forChild(CreateOwnTaskPage),
  ],
  exports: [
    CreateOwnTaskPage
  ]
})
export class CreateOwnTaskPageModule {}
