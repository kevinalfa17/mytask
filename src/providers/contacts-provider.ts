import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ProfileData } from "./profile-data";
import 'rxjs/add/operator/map';


@Injectable()
export class ContactsProvider {

  contactsList: FirebaseListObservable<any[]>;

  /**
   * Constructor
   * @param af 
   * @param up 
   */
  constructor(public af: AngularFire, public up: ProfileData) {
    console.log('Hello ContactsProvider Provider');
  }


  /**
   * Get contacts from DB
   */
  getContactsRef() {
    return this.af.database.list('contacts', {
      query: {
        orderByChild: 'ownerid',
        equalTo: this.up.currentUser.uid
      }
    });

  }

  /**
   * Get an array with all emails
   */
  getContactsEmail() {
    return this.getEmailArray(this.af,this.up);
  }

  /**
   * Promise function to get the emails
   * @param af 
   * @param up 
   */
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

  /**
   * Add user to contacts list of another user
   * @param cName 
   * @param cEmail 
   * @param cPhone 
   */
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
