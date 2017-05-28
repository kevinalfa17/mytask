import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';

@Injectable()
export class ProfileData {
  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;
  public notificationsReference: firebase.database.Reference;
  public ListNotifications: any;
  public numberNewNotifications = 0;


  constructor(public af: AngularFire) {

    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
    });
    this.userProfile = firebase.database().ref('/userProfile');
  }


  getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/userProfile')
        .child(firebase.auth().currentUser.uid)
        .on('value', data => {
          resolve(data.val());
        });
    });
  }


  updateName(firstName: string, lastName: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      firstName: firstName,
      lastName: lastName,
    });
  }

  updateDOB(birthDate: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      birthDate: birthDate,
    });
  }

  updateEmail(newEmail: string, password: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, password);

    return this.currentUser.reauthenticate(credential).then(user => {
      this.currentUser.updateEmail(newEmail).then(user => {
        this.userProfile.child(this.currentUser.uid)
          .update({ email: newEmail });
      });
    });
  }


  updatePassword(newPassword: string, oldPassword: string): firebase.Promise<any> {
    const credential = firebase.auth.EmailAuthProvider
      .credential(this.currentUser.email, oldPassword);

    return this.currentUser.reauthenticate(credential).then(user => {
      this.currentUser.updatePassword(newPassword).then(user => {
        console.log("Password Changed");
      }, error => {
        console.log(error);
      });
    });
  }

  updateaddress(newAddress: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      address: newAddress,
    });
  }

  updatephone(newphone: string): firebase.Promise<any> {
    return this.userProfile.child(this.currentUser.uid).update({
      phone: newphone,
    });
  }

  getAllUsers() {
    return this.af.database.list('/userProfile');
  }

  getuidcurrent() {
    return this.currentUser.uid;
  }

  gooutuser() {
    this.numberNewNotifications = 0;
    this.ListNotifications = null;
    this.currentUser.reload();
  }

  getNotifications() {
    this.notificationsReference = firebase.database().ref(`userProfile/${this.currentUser.uid}/notifications`);
    this.notificationsReference.orderByChild('Type').on('value', snapshot => {
      let rawList = [];
      this.numberNewNotifications = 0;
      snapshot.forEach(snap => {
        if (snap.val().Read == 'false') {
          this.numberNewNotifications = this.numberNewNotifications + 1;
        }
        rawList.push({
          id: snap.key,
          Name: snap.val().Name,
          Description: snap.val().Description,
          Type: snap.val().Type,
          From: snap.val().From,
          Condition: snap.val().Condition,
          DateSended: snap.val().DateSended,
          HourSended: snap.val().HourSended
        });
        return false
      })
      this.ListNotifications = rawList;
      return this.ListNotifications;
    });

}

getUserbyEmail(email) {
     
    return this.af.database.list('userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    });

  }
}
