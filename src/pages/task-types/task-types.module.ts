import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TaskTypesPage } from './task-types';

@NgModule({
  declarations: [
    TaskTypesPage,
  ],
  imports: [
    //IonicModule.forChild(TaskTypesPage),
  ],
  exports: [
    TaskTypesPage
  ]
})
export class TaskTypesModule {}
