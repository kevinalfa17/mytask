import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NewContactPage } from './new-contact';

@NgModule({
  declarations: [
    NewContactPage,
  ],
  imports: [
    //IonicModule.forChild(NewContact),
  ],
  exports: [
    NewContactPage
  ]
})
export class NewContactModule {}
