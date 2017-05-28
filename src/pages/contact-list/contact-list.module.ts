import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ContactListPage } from './contact-list';

@NgModule({
  declarations: [
    ContactListPage,
  ],
  imports: [
    //IonicModule.forChild(ContactList),
  ],
  exports: [
    ContactListPage
  ]
})
export class ContactListModule {}
