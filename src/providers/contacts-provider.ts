import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';


@Injectable()
export class ContactsProvider {

  contactsList: FirebaseListObservable<any[]>;

  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello ContactsProvider Provider');
  }



  getContactsRef() {
    return this.af.database.list('contacts', {
      query: {
        orderByChild: 'ownerid',
        equalTo: this.up.currentUser.uid
      }
    });

  }

  getContactsEmail() {
    return this.getEmailArray(this.af,this.up);
  }


  getEmailArray(af:AngularFire,up: ProfileData) {

    let promise = new Promise(function (resolve, reject) {
      var emails: Array<string>;
      emails = [];
      af.database.list('contacts', {
        query: {
          orderByChild: 'ownerid',
          equalTo: up.currentUser.uid
        },
      preserveSnapshot: true
      }).subscribe(snapshots =>{
        snapshots.forEach(snapshot =>{
          if (snapshot.key !== null) {
            emails.push(snapshot.val().email);
          }

        });
        resolve(emails);
      });

    });
    return promise;

  }



  addNewContact(cName, cEmail, cPhone) {

    let contact = {
      ownerid: this.up.currentUser.uid,
      name: cName,
      email: cEmail,
      phone: cPhone
    };
    this.af.database.list(`/contacts`).push(contact);
  };


}
