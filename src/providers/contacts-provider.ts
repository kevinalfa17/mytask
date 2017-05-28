import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';


@Injectable()
export class ContactsProvider {

  contactsList:FirebaseListObservable<any[]>; 

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello ContactsProvider Provider');
  }



   getContactsRef(){
    return  this.af.database.list('contacts', {
      query: {
        orderByChild: 'ownerid',
        equalTo: this.up.currentUser.uid
      }
    });

  }



  addNewContact(cName,cEmail,cPhone) {

    let contact = {
          ownerid: this.up.currentUser.uid,
          name: cName,
          email:cEmail,
          phone:cPhone
    };
        this.af.database.list(`/contacts`).push(contact);
  };


}
