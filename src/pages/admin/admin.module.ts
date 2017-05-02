import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AdminPage } from './admin';

@NgModule({
  declarations: [
    AdminPage,
  ],
  imports: [
    //IonicModule.forChild(AdminPage),
  ],
  exports: [
    AdminPage
  ]
})
export class AdminModule {}
