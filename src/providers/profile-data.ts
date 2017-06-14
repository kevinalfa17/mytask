import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';

@Injectable()
export class ProfileData {
  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;

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
    this.currentUser.reload();
  }


  insertTask(email, key, subnode, task) {

    var userkey;
    this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          var yourRef = this.af.database.list(`/userProfile/${snapshot.key}/${subnode}`);
          task.phone = snapshot.val().phone;
          yourRef.update(key, task);
        }

      });
    })

  }




  updateStatus(email, key, newStatus) {

    var userkey;
    this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          console.log("444");
          var yourRef = this.af.database.object(`/userProfile/${snapshot.key}/delegatedTasks/${key}`);
          yourRef.update({status:newStatus})
        }

      });
    })

  }

  insertNotification(email, description, name, type, creatorid, key) {

    var userkey;
    this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {

          //Create notif. PD: snapshot.key es el id del destinatario
        }

      });
    })

  }

endTask(email, key,subnode) {

    var userkey;
    this.af.database.list('/userProfile', {
      query: {
        orderByChild: 'email',
        equalTo: email
      },
      preserveSnapshot: true
    }).subscribe(snapshots => {
      snapshots.forEach(snapshot => {

        if (snapshot.key !== null) {
          var yourRef = this.af.database.object(`/userProfile/${snapshot.key}/${subnode}/${key}`);
          yourRef.remove();
        }

      });
    })

  }




}
